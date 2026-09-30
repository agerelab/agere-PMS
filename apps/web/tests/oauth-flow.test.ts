import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Db } from "@/db/client";
import { integrationOauthStates, workspaceIntegrations } from "@/db/schema";
import { decryptSecret } from "@/lib/crypto/token-cipher";
import { completeOAuthCallback, connectWithApiKey, disconnect, listIntegrations, startConnect } from "@/modules/integrations/service";
import { ADMIN, adminCtx, bodyOf, freshDb, jsonRes, memberCtx, mockFetch, ORG, setTestEnv } from "./helpers";

let db: Db;
beforeEach(async () => {
  setTestEnv();
  ({ db } = await freshDb());
});
afterEach(() => vi.unstubAllGlobals());

const stateOf = (url: string) => new URL(url).searchParams.get("state")!;

describe("catalog", () => {
  it("lists all 17 apps with status and whether the server has credentials", async () => {
    const items = await listIntegrations(db, adminCtx);
    expect(items).toHaveLength(17);
    expect(new Set(items.map((i) => i.category))).toEqual(new Set(["development", "communication", "storage", "calendar", "design", "crm"]));
    expect(items.every((i) => i.status === "not_connected")).toBe(true);
    expect(items.find((i) => i.id === "github")!.configured).toBe(true);
    expect(items.find((i) => i.id === "slack")!.configured).toBe(false); // no SLACK_* env
    expect(items.find((i) => i.id === "zendesk")!.fields.map((f) => f.name)).toEqual(["subdomain", "email", "api_token"]);
  });
});

describe("OAuth connect + callback", () => {
  it("builds the GitHub authorize URL and stores only a hash of the state", async () => {
    const { url } = await startConnect(db, adminCtx, "github");
    const u = new URL(url);
    expect(u.origin + u.pathname).toBe("https://github.com/login/oauth/authorize");
    expect(u.searchParams.get("client_id")).toBe("gh-client");
    expect(u.searchParams.get("redirect_uri")).toBe("https://app.agere.test/api/v1/integrations/github/callback");
    expect(u.searchParams.get("scope")).toBe("repo admin:repo_hook read:user");
    const rows = await db.select().from(integrationOauthStates);
    expect(rows).toHaveLength(1);
    expect(rows[0].stateHash).not.toBe(stateOf(url));
  });

  it("only lets admins connect workspace apps", async () => {
    await expect(startConnect(db, memberCtx, "github")).rejects.toMatchObject({ status: 403 });
  });

  it("refuses apps without server credentials", async () => {
    await expect(startConnect(db, adminCtx, "slack")).rejects.toMatchObject({ code: "NOT_CONFIGURED" });
  });

  it("exchanges the code, stores tokens encrypted, and burns the state", async () => {
    const { url } = await startConnect(db, adminCtx, "github", { redirectTo: "/app-center?tab=dev" });
    const calls = mockFetch([
      { match: (u) => u === "https://github.com/login/oauth/access_token", respond: () => jsonRes({ access_token: "gho_live", scope: "repo,admin:repo_hook", token_type: "bearer" }) },
      { match: (u) => u === "https://api.github.com/user", respond: () => jsonRes({ id: 42, login: "octo" }) },
    ]);
    const r = await completeOAuthCallback(db, "github", { state: stateOf(url), code: "the-code", error: null }, adminCtx);
    expect(r).toEqual({ ok: true, redirectTo: "/app-center?tab=dev" });
    expect(bodyOf(calls[0].init).get("code")).toBe("the-code");
    expect(bodyOf(calls[0].init).get("client_secret")).toBe("gh-secret");

    const [row] = await db.select().from(workspaceIntegrations);
    expect(row).toMatchObject({ organizationId: ORG, appId: "github", status: "connected", externalAccountName: "octo", connectedBy: ADMIN });
    expect(row.encryptedAccessToken).not.toContain("gho_live");
    expect(decryptSecret(row.encryptedAccessToken!, `${ORG}:github:access`)).toBe("gho_live");
    expect(row.encryptedWebhookSecret).toBeTruthy();

    // replaying the same callback finds no state
    const again = await completeOAuthCallback(db, "github", { state: stateOf(url), code: "the-code", error: null }, adminCtx);
    expect(again).toMatchObject({ ok: false, code: "INVALID_STATE" });
    expect((await listIntegrations(db, adminCtx)).find((i) => i.id === "github")).toMatchObject({ status: "connected", account: "octo" });
  });

  it("uses PKCE and offline access for Google", async () => {
    const { url } = await startConnect(db, adminCtx, "google-drive");
    const u = new URL(url);
    expect(u.searchParams.get("code_challenge_method")).toBe("S256");
    expect(u.searchParams.get("access_type")).toBe("offline");
    expect(u.searchParams.get("scope")).toContain("https://www.googleapis.com/auth/drive.file");
    const calls = mockFetch([
      { match: (x) => x === "https://oauth2.googleapis.com/token", respond: () => jsonRes({ access_token: "ya29.a", refresh_token: "1//r", expires_in: 3599, scope: "drive.file" }) },
      { match: (x) => x.startsWith("https://openidconnect.googleapis.com/"), respond: () => jsonRes({ sub: "g1", email: "admin@example.com" }) },
    ]);
    await completeOAuthCallback(db, "google-drive", { state: u.searchParams.get("state"), code: "c", error: null }, adminCtx);
    const verifier = bodyOf(calls[0].init).get("code_verifier")!;
    const { createHash } = await import("node:crypto");
    expect(createHash("sha256").update(verifier).digest("base64url")).toBe(u.searchParams.get("code_challenge"));
    const [row] = await db.select().from(workspaceIntegrations).where(eq(workspaceIntegrations.appId, "google-drive"));
    expect(row.tokenExpiresAt!.getTime()).toBeGreaterThan(Date.now() + 3500_000);
    expect(decryptSecret(row.encryptedRefreshToken!, `${ORG}:google-drive:refresh`)).toBe("1//r");
  });

  it("rejects a callback finished by a different user (login CSRF)", async () => {
    const { url } = await startConnect(db, adminCtx, "github");
    const r = await completeOAuthCallback(db, "github", { state: stateOf(url), code: "c", error: null }, { ...memberCtx, role: "admin" });
    expect(r).toMatchObject({ ok: false, code: "SESSION_MISMATCH" });
  });

  it("rejects an expired state", async () => {
    const { url } = await startConnect(db, adminCtx, "github");
    await db.update(integrationOauthStates).set({ expiresAt: new Date(Date.now() - 1000) });
    expect(await completeOAuthCallback(db, "github", { state: stateOf(url), code: "c", error: null }, adminCtx)).toMatchObject({ code: "INVALID_STATE" });
  });

  it("reports a denied consent without storing anything", async () => {
    const { url } = await startConnect(db, adminCtx, "github");
    expect(await completeOAuthCallback(db, "github", { state: stateOf(url), code: null, error: "access_denied" }, adminCtx)).toMatchObject({ code: "ACCESS_DENIED" });
    expect(await db.select().from(workspaceIntegrations)).toHaveLength(0);
  });

  it("never redirects off-site after the callback", async () => {
    const { url } = await startConnect(db, adminCtx, "github", { redirectTo: "//evil.example/steal" });
    mockFetch([
      { match: (u) => u.includes("access_token"), respond: () => jsonRes({ access_token: "t" }) },
      { match: (u) => u.includes("api.github.com/user"), respond: () => jsonRes({ id: 1, login: "o" }) },
    ]);
    expect(await completeOAuthCallback(db, "github", { state: stateOf(url), code: "c", error: null }, adminCtx)).toMatchObject({ redirectTo: "/app-center" });
  });

  it("surfaces GitHub's 200-with-error token responses as a failure", async () => {
    const { url } = await startConnect(db, adminCtx, "github");
    mockFetch([{ match: () => true, respond: () => jsonRes({ error: "bad_verification_code" }) }]);
    expect(await completeOAuthCallback(db, "github", { state: stateOf(url), code: "old", error: null }, adminCtx)).toMatchObject({ ok: false, code: "TOKEN_EXCHANGE_FAILED" });
  });
});

describe("API key apps", () => {
  it("verifies Clockify credentials and stores the key encrypted", async () => {
    const calls = mockFetch([{ match: (u) => u === "https://api.clockify.me/api/v1/user", respond: () => jsonRes({ id: "u1", email: "ops@example.com" }) }]);
    await connectWithApiKey(db, adminCtx, "clockify", { api_key: "abcdefghijklmnopqrstuvwx" });
    expect(new Headers(calls[0].init?.headers).get("x-api-key")).toBe("abcdefghijklmnopqrstuvwx");
    const [row] = await db.select().from(workspaceIntegrations);
    expect(decryptSecret(row.encryptedAccessToken!, `${ORG}:clockify:access`)).toBe("abcdefghijklmnopqrstuvwx");
    expect(row.externalAccountName).toBe("ops@example.com");
  });

  it("validates the Zendesk subdomain before building any URL", async () => {
    mockFetch([]);
    await expect(connectWithApiKey(db, adminCtx, "zendesk", { subdomain: "evil.com/x#", email: "a@b.co", api_token: "a".repeat(40) })).rejects.toMatchObject({ code: "INVALID_FIELD" });
  });

  it("maps rejected credentials to a 422", async () => {
    mockFetch([{ match: () => true, respond: () => jsonRes({}, 401) }]);
    await expect(connectWithApiKey(db, adminCtx, "toggl-track", { api_token: "a".repeat(32) })).rejects.toMatchObject({ status: 422, code: "CREDENTIALS_REJECTED" });
  });
});

describe("disconnect", () => {
  it("revokes at GitHub, wipes every secret and keeps the row as disconnected", async () => {
    const { url } = await startConnect(db, adminCtx, "github");
    mockFetch([
      { match: (u) => u.includes("access_token"), respond: () => jsonRes({ access_token: "gho_x" }) },
      { match: (u) => u === "https://api.github.com/user", respond: () => jsonRes({ id: 1, login: "o" }) },
    ]);
    await completeOAuthCallback(db, "github", { state: stateOf(url), code: "c", error: null }, adminCtx);
    const calls = mockFetch([{ match: (u, i) => u === "https://api.github.com/applications/gh-client/token" && i?.method === "DELETE", respond: () => new Response(null, { status: 204 }) }]);
    await expect(disconnect(db, memberCtx, "github")).rejects.toMatchObject({ status: 403 });
    await disconnect(db, adminCtx, "github");
    expect(calls).toHaveLength(1);
    const [row] = await db.select().from(workspaceIntegrations);
    expect(row).toMatchObject({ status: "disconnected", encryptedAccessToken: null, encryptedRefreshToken: null, encryptedWebhookSecret: null });
  });
});
