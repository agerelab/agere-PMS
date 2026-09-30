// Data access for the integrations module. Tenant queries take the RequestContext (or an explicit
// organization id for webhook/cron paths that run without a user) and always filter on it.
import { and, asc, eq, lte, sql } from "drizzle-orm";
import type { Db } from "@/db/client";
import {
  integrationApps,
  integrationOauthStates,
  integrationTaskLinks,
  integrationWebhookEvents,
  userIntegrations,
  workspaceIntegrations,
  type TaskLinkKind,
} from "@/db/schema";
import type { RequestContext } from "@/lib/context";
import { uuidv7 } from "@/lib/ids";

export type Org = Pick<RequestContext, "organizationId">;

export const listApps = (db: Db) => db.select().from(integrationApps).orderBy(asc(integrationApps.position));

export const getApp = async (db: Db, appId: string) =>
  (await db.select().from(integrationApps).where(eq(integrationApps.id, appId)).limit(1))[0];

export const listWorkspaceIntegrations = (db: Db, ctx: Org) =>
  db.select().from(workspaceIntegrations).where(eq(workspaceIntegrations.organizationId, ctx.organizationId));

export const getWorkspaceIntegration = async (db: Db, ctx: Org, appId: string) =>
  (
    await db
      .select()
      .from(workspaceIntegrations)
      .where(and(eq(workspaceIntegrations.organizationId, ctx.organizationId), eq(workspaceIntegrations.appId, appId)))
      .limit(1)
  )[0];

export type ConnectionValues = {
  encryptedAccessToken: string;
  encryptedRefreshToken: string | null;
  tokenExpiresAt: Date | null;
  scopes: string | null;
  externalAccountId: string | null;
  externalAccountName: string | null;
};

export async function upsertWorkspaceConnection(
  db: Db,
  ctx: Org,
  appId: string,
  v: ConnectionValues & { connectedBy: string; settings?: Record<string, unknown>; encryptedWebhookSecret?: string | null },
) {
  const now = new Date();
  const values = {
    ...v,
    status: "connected" as const,
    connectedAt: now,
    lastRefreshedAt: now,
    refreshFailures: 0,
    lastError: null,
    updatedAt: now,
  };
  await db
    .insert(workspaceIntegrations)
    .values({ organizationId: ctx.organizationId, appId, settings: v.settings ?? {}, ...values })
    .onConflictDoUpdate({
      target: [workspaceIntegrations.organizationId, workspaceIntegrations.appId],
      set: {
        ...values,
        // keep settings chosen earlier (e.g. GitHub repositories) when reconnecting
        settings: v.settings ? v.settings : sql`${workspaceIntegrations.settings}`,
        // keep the webhook secret: hooks already installed on repositories still sign with it
        encryptedWebhookSecret: sql`coalesce(${workspaceIntegrations.encryptedWebhookSecret}, ${v.encryptedWebhookSecret ?? null}::text)`,
        version: sql`${workspaceIntegrations.version} + 1`,
      },
    });
}

export async function markWorkspaceDisconnected(db: Db, ctx: Org, appId: string) {
  await db
    .update(workspaceIntegrations)
    .set({
      status: "disconnected",
      encryptedAccessToken: null,
      encryptedRefreshToken: null,
      encryptedWebhookSecret: null,
      tokenExpiresAt: null,
      lastError: null,
      refreshFailures: 0,
      settings: {},
      updatedAt: new Date(),
      version: sql`${workspaceIntegrations.version} + 1`,
    })
    .where(and(eq(workspaceIntegrations.organizationId, ctx.organizationId), eq(workspaceIntegrations.appId, appId)));
  // personal connections depend on the workspace one
  await db.delete(userIntegrations).where(and(eq(userIntegrations.organizationId, ctx.organizationId), eq(userIntegrations.appId, appId)));
}

export async function updateWorkspaceSettings(db: Db, ctx: Org, appId: string, settings: Record<string, unknown>) {
  await db
    .update(workspaceIntegrations)
    .set({ settings, updatedAt: new Date(), version: sql`${workspaceIntegrations.version} + 1` })
    .where(and(eq(workspaceIntegrations.organizationId, ctx.organizationId), eq(workspaceIntegrations.appId, appId)));
}

export const getUserIntegration = async (db: Db, ctx: Org & { userId: string }, appId: string) =>
  (
    await db
      .select()
      .from(userIntegrations)
      .where(and(eq(userIntegrations.organizationId, ctx.organizationId), eq(userIntegrations.userId, ctx.userId), eq(userIntegrations.appId, appId)))
      .limit(1)
  )[0];

export async function upsertUserConnection(db: Db, ctx: Org & { userId: string }, appId: string, v: ConnectionValues) {
  const now = new Date();
  const values = { ...v, status: "connected" as const, lastRefreshedAt: now, refreshFailures: 0, lastError: null, updatedAt: now };
  await db
    .insert(userIntegrations)
    .values({ organizationId: ctx.organizationId, userId: ctx.userId, appId, ...values })
    .onConflictDoUpdate({ target: [userIntegrations.organizationId, userIntegrations.userId, userIntegrations.appId], set: values });
}

export async function deleteUserConnection(db: Db, ctx: Org & { userId: string }, appId: string) {
  await db
    .delete(userIntegrations)
    .where(and(eq(userIntegrations.organizationId, ctx.organizationId), eq(userIntegrations.userId, ctx.userId), eq(userIntegrations.appId, appId)));
}

/* ---------- OAuth state ---------- */

export async function insertOauthState(db: Db, row: typeof integrationOauthStates.$inferInsert) {
  await db.insert(integrationOauthStates).values(row);
}

/** Single use: the row is deleted as it is read, so a replayed callback finds nothing. */
export async function consumeOauthState(db: Db, stateHash: string, appId: string) {
  const rows = await db
    .delete(integrationOauthStates)
    .where(and(eq(integrationOauthStates.stateHash, stateHash), eq(integrationOauthStates.appId, appId)))
    .returning();
  return rows[0];
}

export async function purgeExpiredOauthStates(db: Db, now = new Date()) {
  await db.delete(integrationOauthStates).where(lte(integrationOauthStates.expiresAt, now));
}

/* ---------- webhook events ---------- */

/** Returns the new event id, or null when this delivery was already recorded (provider retry). */
export async function recordWebhookEvent(
  db: Db,
  orgId: string,
  e: { appId: string; deliveryId: string; eventType: string; payload: unknown },
): Promise<string | null> {
  const id = uuidv7();
  const rows = await db
    .insert(integrationWebhookEvents)
    .values({ organizationId: orgId, id, status: "received", ...e })
    .onConflictDoNothing({ target: [integrationWebhookEvents.organizationId, integrationWebhookEvents.appId, integrationWebhookEvents.deliveryId] })
    .returning({ id: integrationWebhookEvents.id });
  return rows[0]?.id ?? null;
}

export async function finishWebhookEvent(db: Db, orgId: string, id: string, status: "processed" | "ignored" | "failed", error?: string) {
  await db
    .update(integrationWebhookEvents)
    .set({ status, error: error ?? null, processedAt: new Date() })
    .where(and(eq(integrationWebhookEvents.organizationId, orgId), eq(integrationWebhookEvents.id, id)));
}

/* ---------- task links ---------- */

export type TaskLinkInput = {
  taskId: string;
  appId: string;
  kind: TaskLinkKind;
  externalId: string;
  url: string;
  title: string;
  metadata: Record<string, unknown>;
  createdBy?: string | null;
};

export async function upsertTaskLink(db: Db, orgId: string, l: TaskLinkInput) {
  const now = new Date();
  const rows = await db
    .insert(integrationTaskLinks)
    .values({ organizationId: orgId, id: uuidv7(), ...l, createdBy: l.createdBy ?? null })
    .onConflictDoUpdate({
      target: [integrationTaskLinks.organizationId, integrationTaskLinks.taskId, integrationTaskLinks.appId, integrationTaskLinks.kind, integrationTaskLinks.externalId],
      set: { url: l.url, title: l.title, metadata: l.metadata, updatedAt: now },
    })
    .returning();
  return rows[0];
}

export const listTaskLinks = (db: Db, ctx: Org, taskId: string) =>
  db
    .select()
    .from(integrationTaskLinks)
    .where(and(eq(integrationTaskLinks.organizationId, ctx.organizationId), eq(integrationTaskLinks.taskId, taskId)))
    .orderBy(asc(integrationTaskLinks.createdAt));

export async function deleteTaskLink(db: Db, ctx: Org, taskId: string, linkId: string) {
  const rows = await db
    .delete(integrationTaskLinks)
    .where(
      and(eq(integrationTaskLinks.organizationId, ctx.organizationId), eq(integrationTaskLinks.taskId, taskId), eq(integrationTaskLinks.id, linkId)),
    )
    .returning({ id: integrationTaskLinks.id });
  return rows.length > 0;
}
