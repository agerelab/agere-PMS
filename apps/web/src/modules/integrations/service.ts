// Integration Engine: catalog, OAuth connect/callback, API-key connect, disconnect, and access
// tokens that refresh themselves. Route handlers stay thin and call into here.
import { and, eq, isNotNull, lte } from "drizzle-orm";
import type { Db } from "@/db/client";
import { userIntegrations, workspaceIntegrations, type WorkspaceIntegration } from "@/db/schema";
import { HttpError, requireAdmin, type RequestContext } from "@/lib/context";
import { decryptSecret, encryptSecret, nullableDecrypt, nullableEncrypt } from "@/lib/crypto/token-cipher";
import { buildAuthorizeUrl, exchangeCode, OAuthError, randomToken, refreshAccessToken, sha256, type TokenSet } from "./providers/oauth";
import { getProvider, isConfigured, oauthCredentials, type OAuthProvider } from "./providers/registry";
import * as repo from "./repository";

const STATE_TTL_MS = 10 * 60 * 1000;
/** Refresh a token when it has less than this left. */
export const REFRESH_WINDOW_MS = 10 * 60 * 1000;
const MAX_REFRESH_FAILURES = 5;

type Scope = "workspace" | "user";
/** Context strings bind each ciphertext to its row (see token-cipher). */
const aad = (orgId: string, appId: string, kind: string, userId?: string) =>
  userId ? `${orgId}:${appId}:user:${userId}:${kind}` : `${orgId}:${appId}:${kind}`;

export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  iconUrl: string;
  authType: "oauth2" | "api_key";
  description: { en: string; id: string };
  configured: boolean;
  status: "connected" | "error" | "not_connected";
  account: string | null;
  connectedAt: string | null;
  error: string | null;
  personalAccounts: boolean;
  personalStatus: "connected" | "error" | "not_connected" | null;
  fields: { name: string; label: { en: string; id: string }; secret: boolean }[];
};

/* ---------------- catalog ---------------- */

export async function listIntegrations(db: Db, ctx: RequestContext): Promise<CatalogItem[]> {
  const [apps, rows] = await Promise.all([repo.listApps(db), repo.listWorkspaceIntegrations(db, ctx)]);
  const personal = await db
    .select({ appId: userIntegrations.appId, status: userIntegrations.status })
    .from(userIntegrations)
    .where(and(eq(userIntegrations.organizationId, ctx.organizationId), eq(userIntegrations.userId, ctx.userId)));
  const byApp = new Map(rows.map((r) => [r.appId, r]));
  const personalByApp = new Map(personal.map((r) => [r.appId, r.status]));
  return apps.flatMap((a) => {
    const p = getProvider(a.id);
    if (!p) return []; // catalog row without an engine definition: hide rather than offer a dead button
    const r = byApp.get(a.id);
    const status = !r || r.status === "disconnected" ? "not_connected" : r.status;
    const personalAccounts = p.kind === "oauth2" && !!p.personalAccounts;
    return [
      {
        id: a.id,
        name: a.name,
        category: a.category,
        iconUrl: a.iconUrl,
        authType: a.authType,
        description: { en: a.descriptionEn, id: a.descriptionId },
        configured: isConfigured(p),
        status,
        account: status === "not_connected" ? null : (r?.externalAccountName ?? null),
        connectedAt: status === "not_connected" ? null : (r?.connectedAt?.toISOString() ?? null),
        error: status === "error" ? (r?.lastError ?? "reauthorize") : null,
        personalAccounts,
        personalStatus: personalAccounts
          ? (personalByApp.get(a.id) ?? (r?.connectedBy === ctx.userId && status === "connected" ? "connected" : "not_connected"))
          : null,
        fields: p.kind === "api_key" ? p.fields.map((f) => ({ name: f.name, label: f.label, secret: !!f.secret })) : [],
      },
    ];
  });
}

function oauthProviderOr404(appId: string): OAuthProvider {
  const p = getProvider(appId);
  if (!p) throw new HttpError(404, "UNKNOWN_APP");
  if (p.kind !== "oauth2") throw new HttpError(400, "API_KEY_APP", "This app connects with an API key, not OAuth");
  if (!oauthCredentials(p)) throw new HttpError(409, "NOT_CONFIGURED", "OAuth credentials for this app are not configured on the server");
  return p;
}

/** Only same-origin relative paths; anything else could turn the callback into an open redirect. */
export function safeRedirect(path: string | null | undefined, fallback = "/app-center") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return fallback;
  return path;
}

/* ---------------- OAuth connect ---------------- */

export async function startConnect(db: Db, ctx: RequestContext, appId: string, opts: { personal?: boolean; redirectTo?: string } = {}) {
  const p = oauthProviderOr404(appId);
  if (opts.personal) {
    if (!p.personalAccounts) throw new HttpError(400, "NO_PERSONAL_ACCOUNTS");
    const ws = await repo.getWorkspaceIntegration(db, ctx, appId);
    if (ws?.status !== "connected") throw new HttpError(409, "WORKSPACE_NOT_CONNECTED", "An admin has to connect this app for the workspace first");
  } else {
    requireAdmin(ctx);
  }
  const state = randomToken(32);
  const stateHash = sha256(state);
  const verifier = p.pkce ? randomToken(48) : null;
  await repo.purgeExpiredOauthStates(db);
  await repo.insertOauthState(db, {
    stateHash,
    organizationId: ctx.organizationId,
    userId: ctx.userId,
    appId,
    codeVerifier: nullableEncrypt(verifier, `oauth-state:${stateHash}`),
    personal: !!opts.personal,
    redirectTo: safeRedirect(opts.redirectTo),
    expiresAt: new Date(Date.now() + STATE_TTL_MS),
  });
  return { url: buildAuthorizeUrl(appId, p, state, verifier), expiresInSeconds: STATE_TTL_MS / 1000 };
}

export type CallbackResult = { ok: true; redirectTo: string } | { ok: false; redirectTo: string; code: string };

export async function completeOAuthCallback(
  db: Db,
  appId: string,
  q: { state: string | null; code: string | null; error: string | null },
  session: RequestContext | null,
): Promise<CallbackResult> {
  const fail = (code: string, redirectTo = "/app-center"): CallbackResult => ({ ok: false, code, redirectTo });
  const p = getProvider(appId);
  if (!p || p.kind !== "oauth2" || !q.state) return fail("INVALID_STATE");
  const stateHash = sha256(q.state);
  const st = await repo.consumeOauthState(db, stateHash, appId);
  if (!st || st.expiresAt.getTime() < Date.now()) return fail("INVALID_STATE");
  const redirectTo = safeRedirect(st.redirectTo);
  // The browser finishing the flow must belong to the user who started it (login CSRF guard).
  if (session && (session.userId !== st.userId || session.organizationId !== st.organizationId)) return fail("SESSION_MISMATCH", redirectTo);
  if (q.error) return fail(q.error === "access_denied" ? "ACCESS_DENIED" : "PROVIDER_ERROR", redirectTo);
  if (!q.code) return fail("MISSING_CODE", redirectTo);

  let tokens: TokenSet;
  try {
    tokens = await exchangeCode(appId, p, q.code, nullableDecrypt(st.codeVerifier, `oauth-state:${stateHash}`));
  } catch (e) {
    console.error(`[integrations] ${appId} code exchange failed:`, (e as Error).message);
    return fail(e instanceof OAuthError ? e.code : "TOKEN_EXCHANGE_FAILED", redirectTo);
  }
  const account = await accountOf(appId, p, tokens);
  const orgCtx = { organizationId: st.organizationId, userId: st.userId };
  if (st.personal) {
    await repo.upsertUserConnection(db, orgCtx, appId, encryptTokens(st.organizationId, appId, tokens, account, st.userId));
  } else {
    await repo.upsertWorkspaceConnection(db, orgCtx, appId, {
      ...encryptTokens(st.organizationId, appId, tokens, account),
      connectedBy: st.userId,
      // GitHub signs deliveries with this; generated once and kept across reconnects
      encryptedWebhookSecret: appId === "github" || appId === "gitlab" ? encryptSecret(randomToken(32), aad(st.organizationId, appId, "webhook")) : null,
    });
  }
  return { ok: true, redirectTo };
}

async function accountOf(appId: string, p: OAuthProvider, t: TokenSet) {
  if (appId === "slack") {
    const team = t.raw.team as { id?: string; name?: string } | undefined;
    return { id: team?.id ?? null, name: team?.name ?? null };
  }
  try {
    const a = p.account ? await p.account(t.accessToken) : null;
    return { id: a?.id ?? null, name: a?.name ?? null };
  } catch (e) {
    // The connection works without a display name; don't fail the whole connect over it.
    console.warn(`[integrations] ${appId} account lookup failed:`, (e as Error).message);
    return { id: null, name: null };
  }
}

function encryptTokens(orgId: string, appId: string, t: TokenSet, account: { id: string | null; name: string | null }, userId?: string) {
  return {
    encryptedAccessToken: encryptSecret(t.accessToken, aad(orgId, appId, "access", userId)),
    encryptedRefreshToken: nullableEncrypt(t.refreshToken, aad(orgId, appId, "refresh", userId)),
    tokenExpiresAt: t.expiresAt,
    scopes: t.scope,
    externalAccountId: account.id,
    externalAccountName: account.name,
  };
}

/* ---------------- API key connect ---------------- */

export async function connectWithApiKey(db: Db, ctx: RequestContext, appId: string, input: unknown) {
  requireAdmin(ctx);
  const p = getProvider(appId);
  if (!p) throw new HttpError(404, "UNKNOWN_APP");
  if (p.kind !== "api_key") throw new HttpError(400, "OAUTH_APP", "This app connects with OAuth");
  const body = (input ?? {}) as Record<string, unknown>;
  const values: Record<string, string> = {};
  for (const f of p.fields) {
    const v = typeof body[f.name] === "string" ? (body[f.name] as string).trim() : "";
    if (!v || (f.pattern && !f.pattern.test(v))) throw new HttpError(422, "INVALID_FIELD", `Check the ${f.label.en.toLowerCase()}`);
    values[f.name] = v;
  }
  let account: { id?: string; name?: string };
  try {
    account = await p.verify(values);
  } catch (e) {
    console.warn(`[integrations] ${appId} API key verification failed:`, (e as Error).message);
    throw new HttpError(422, "CREDENTIALS_REJECTED", "The app did not accept these credentials");
  }
  const { [p.secretField]: secret, ...settings } = values;
  await repo.upsertWorkspaceConnection(db, ctx, appId, {
    encryptedAccessToken: encryptSecret(secret, aad(ctx.organizationId, appId, "access")),
    encryptedRefreshToken: null,
    tokenExpiresAt: null,
    scopes: null,
    externalAccountId: account.id ?? null,
    externalAccountName: account.name ?? null,
    connectedBy: ctx.userId,
    settings,
  });
}

/* ---------------- disconnect ---------------- */

export async function disconnect(db: Db, ctx: RequestContext, appId: string, opts: { personal?: boolean } = {}) {
  const p = getProvider(appId);
  if (!p) throw new HttpError(404, "UNKNOWN_APP");
  if (opts.personal) {
    const row = await repo.getUserIntegration(db, ctx, appId);
    if (row) {
      await revokeBestEffort(appId, p, decryptSecret(row.encryptedAccessToken, aad(ctx.organizationId, appId, "access", ctx.userId)));
      await repo.deleteUserConnection(db, ctx, appId);
    }
    return;
  }
  requireAdmin(ctx);
  const row = await repo.getWorkspaceIntegration(db, ctx, appId);
  if (!row || row.status === "disconnected") return;
  if (row.encryptedAccessToken) {
    await revokeBestEffort(appId, p, decryptSecret(row.encryptedAccessToken, aad(ctx.organizationId, appId, "access")));
  }
  await repo.markWorkspaceDisconnected(db, ctx, appId);
}

/** Revoke at the provider where it has an endpoint; the local delete happens regardless. */
async function revokeBestEffort(appId: string, p: ReturnType<typeof getProvider>, token: string) {
  try {
    if (appId === "github" && p?.kind === "oauth2") {
      const c = oauthCredentials(p);
      if (!c) return;
      await fetch(`https://api.github.com/applications/${c.clientId}/token`, {
        method: "DELETE",
        headers: { authorization: `Basic ${Buffer.from(`${c.clientId}:${c.clientSecret}`).toString("base64")}`, accept: "application/vnd.github+json" },
        body: JSON.stringify({ access_token: token }),
        signal: AbortSignal.timeout(5000),
      });
    } else if (appId === "google-drive" || appId === "google-calendar") {
      await fetch("https://oauth2.googleapis.com/revoke", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token }),
        signal: AbortSignal.timeout(5000),
      });
    }
  } catch (e) {
    console.warn(`[integrations] ${appId} revoke failed:`, (e as Error).message);
  }
}

/* ---------------- access tokens + refresh ---------------- */

type TokenRow = {
  scope: Scope;
  organizationId: string;
  appId: string;
  userId?: string;
  encryptedAccessToken: string | null;
  encryptedRefreshToken: string | null;
  tokenExpiresAt: Date | null;
  refreshFailures: number;
};

/** A usable access token for the workspace connection, refreshed first if it is about to expire. */
export async function getWorkspaceAccessToken(db: Db, orgId: string, appId: string): Promise<string> {
  const row = await repo.getWorkspaceIntegration(db, { organizationId: orgId }, appId);
  if (!row || row.status !== "connected" || !row.encryptedAccessToken) throw new HttpError(409, "NOT_CONNECTED", `${appId} is not connected`);
  return ensureFresh(db, { ...row, scope: "workspace" });
}

/**
 * The token a member uses for a personal-account app (Google Drive). Falls back to the workspace
 * connection only for the person who made it — never hands one member's account to another.
 */
export async function getPersonalAccessToken(db: Db, ctx: RequestContext, appId: string): Promise<{ token: string; expiresAt: Date | null }> {
  const ws = await repo.getWorkspaceIntegration(db, ctx, appId);
  if (ws?.status !== "connected") throw new HttpError(409, "WORKSPACE_NOT_CONNECTED", "This app is not connected for the workspace");
  const mine = await repo.getUserIntegration(db, ctx, appId);
  if (mine?.status === "connected") {
    const token = await ensureFresh(db, { ...mine, scope: "user" });
    const fresh = await repo.getUserIntegration(db, ctx, appId);
    return { token, expiresAt: fresh?.tokenExpiresAt ?? null };
  }
  if (ws.connectedBy === ctx.userId && ws.encryptedAccessToken) {
    const token = await ensureFresh(db, { ...ws, scope: "workspace" });
    const fresh = await repo.getWorkspaceIntegration(db, ctx, appId);
    return { token, expiresAt: fresh?.tokenExpiresAt ?? null };
  }
  throw new HttpError(409, "PERSONAL_CONNECTION_REQUIRED", "Connect your own account to use this app");
}

async function ensureFresh(db: Db, row: TokenRow): Promise<string> {
  const ctx = aad(row.organizationId, row.appId, "access", row.scope === "user" ? row.userId : undefined);
  const soon = row.tokenExpiresAt && row.tokenExpiresAt.getTime() - Date.now() < 60_000;
  if (soon && row.encryptedRefreshToken) {
    const refreshed = await refreshRow(db, row);
    if (refreshed) return refreshed;
    throw new HttpError(409, "REAUTHORIZE", "The connection expired; reconnect the app");
  }
  return decryptSecret(row.encryptedAccessToken!, ctx);
}

/**
 * Refreshes one connection under a row lock (SKIP LOCKED: if the cron and a request race, one
 * refreshes and the other skips). Returns the new access token, or null if the row was locked,
 * no longer due, or the refresh failed.
 */
async function refreshRow(db: Db, row: TokenRow): Promise<string | null> {
  const p = getProvider(row.appId);
  if (!p || p.kind !== "oauth2") return null;
  const uid = row.scope === "user" ? row.userId : undefined;
  return db.transaction(async (tx) => {
    const locked =
      row.scope === "workspace"
        ? (
            await tx
              .select()
              .from(workspaceIntegrations)
              .where(and(eq(workspaceIntegrations.organizationId, row.organizationId), eq(workspaceIntegrations.appId, row.appId), eq(workspaceIntegrations.status, "connected")))
              .for("update", { skipLocked: true })
          )[0]
        : (
            await tx
              .select()
              .from(userIntegrations)
              .where(
                and(eq(userIntegrations.organizationId, row.organizationId), eq(userIntegrations.userId, uid!), eq(userIntegrations.appId, row.appId), eq(userIntegrations.status, "connected")),
              )
              .for("update", { skipLocked: true })
          )[0];
    if (!locked?.encryptedRefreshToken) return null;
    // Someone refreshed it while we waited: use theirs.
    if (locked.tokenExpiresAt && locked.tokenExpiresAt.getTime() - Date.now() > REFRESH_WINDOW_MS) {
      return decryptSecret(locked.encryptedAccessToken!, aad(row.organizationId, row.appId, "access", uid));
    }
    const refreshToken = decryptSecret(locked.encryptedRefreshToken, aad(row.organizationId, row.appId, "refresh", uid));
    const now = new Date();
    try {
      const t = await refreshAccessToken(p, refreshToken);
      const set = {
        encryptedAccessToken: encryptSecret(t.accessToken, aad(row.organizationId, row.appId, "access", uid)),
        // providers that rotate refresh tokens send a new one; the others keep the old one valid
        encryptedRefreshToken: t.refreshToken ? encryptSecret(t.refreshToken, aad(row.organizationId, row.appId, "refresh", uid)) : locked.encryptedRefreshToken,
        tokenExpiresAt: t.expiresAt,
        lastRefreshedAt: now,
        refreshFailures: 0,
        lastError: null,
        updatedAt: now,
      };
      if (row.scope === "workspace") {
        await tx.update(workspaceIntegrations).set(set).where(and(eq(workspaceIntegrations.organizationId, row.organizationId), eq(workspaceIntegrations.appId, row.appId)));
      } else {
        await tx
          .update(userIntegrations)
          .set(set)
          .where(and(eq(userIntegrations.organizationId, row.organizationId), eq(userIntegrations.userId, uid!), eq(userIntegrations.appId, row.appId)));
      }
      return t.accessToken;
    } catch (e) {
      const code = e instanceof OAuthError ? e.code : "NETWORK";
      // invalid_grant = the user revoked access or the refresh token died: only a reconnect helps.
      const dead = code === "INVALID_GRANT" || locked.refreshFailures + 1 >= MAX_REFRESH_FAILURES;
      const set = {
        refreshFailures: locked.refreshFailures + 1,
        lastError: dead ? "reauthorize" : code,
        updatedAt: now,
        ...(dead ? { status: "error" as const } : {}),
      };
      console.warn(`[integrations] refresh ${row.appId} for ${row.organizationId} failed: ${code}${dead ? " (marked error)" : ""}`);
      if (row.scope === "workspace") {
        await tx.update(workspaceIntegrations).set(set).where(and(eq(workspaceIntegrations.organizationId, row.organizationId), eq(workspaceIntegrations.appId, row.appId)));
      } else {
        await tx
          .update(userIntegrations)
          .set(set)
          .where(and(eq(userIntegrations.organizationId, row.organizationId), eq(userIntegrations.userId, uid!), eq(userIntegrations.appId, row.appId)));
      }
      return null;
    }
  });
}

/** Background job: refresh every connection that expires within the window. */
export async function refreshExpiringTokens(db: Db, opts: { windowMs?: number; limit?: number } = {}) {
  const due = new Date(Date.now() + (opts.windowMs ?? REFRESH_WINDOW_MS));
  const limit = opts.limit ?? 100;
  const ws = await db
    .select()
    .from(workspaceIntegrations)
    .where(and(eq(workspaceIntegrations.status, "connected"), isNotNull(workspaceIntegrations.encryptedRefreshToken), lte(workspaceIntegrations.tokenExpiresAt, due)))
    .limit(limit);
  const us = await db
    .select()
    .from(userIntegrations)
    .where(and(eq(userIntegrations.status, "connected"), isNotNull(userIntegrations.encryptedRefreshToken), lte(userIntegrations.tokenExpiresAt, due)))
    .limit(limit);
  const result = { checked: ws.length + us.length, refreshed: 0, failed: 0 };
  const rows: TokenRow[] = [...ws.map((r: WorkspaceIntegration) => ({ ...r, scope: "workspace" as const })), ...us.map((r) => ({ ...r, scope: "user" as const }))];
  for (const r of rows) {
    const t = await refreshRow(db, r);
    if (t) result.refreshed++;
    else result.failed++;
  }
  await repo.purgeExpiredOauthStates(db);
  return result;
}

export { aad as secretContext };
