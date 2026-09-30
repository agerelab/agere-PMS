// Generic webhook listener: authenticate, record once (providers retry), then dispatch.
import type { Db } from "@/db/client";
import { HttpError } from "@/lib/context";
import { decryptSecret } from "@/lib/crypto/token-cipher";
import { handleGithubEvent } from "../github/events";
import * as repo from "../repository";
import { secretContext } from "../service";
import { VERIFIERS, webhookSupported } from "./verify";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const MAX_WEBHOOK_BYTES = 1024 * 1024;

type Handler = (db: Db, orgId: string, eventType: string, payload: any, settings: Record<string, unknown>) => Promise<{ status: "processed" | "ignored" }>;
const HANDLERS: Record<string, Handler> = { github: handleGithubEvent };

export async function receiveWebhook(db: Db, appId: string, workspaceId: string, headers: Headers, rawBody: string) {
  // Same 404 for unknown app, unknown workspace and not-connected: don't reveal which exists.
  if (!webhookSupported(appId) || !UUID.test(workspaceId)) throw new HttpError(404, "NOT_FOUND");
  const row = await repo.getWorkspaceIntegration(db, { organizationId: workspaceId }, appId);
  if (!row || row.status !== "connected" || !row.encryptedWebhookSecret) throw new HttpError(404, "NOT_FOUND");
  const secret = decryptSecret(row.encryptedWebhookSecret, secretContext(workspaceId, appId, "webhook"));
  const verified = VERIFIERS[appId](headers, rawBody, secret);
  if (!verified) throw new HttpError(401, "BAD_SIGNATURE");

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw new HttpError(400, "BAD_JSON");
  }
  const eventId = await repo.recordWebhookEvent(db, workspaceId, { appId, ...verified, payload });
  if (!eventId) return { duplicate: true, status: "duplicate" as const };

  const handler = HANDLERS[appId];
  if (!handler) {
    await repo.finishWebhookEvent(db, workspaceId, eventId, "ignored");
    return { duplicate: false, status: "ignored" as const };
  }
  try {
    const r = await handler(db, workspaceId, verified.eventType, payload, row.settings ?? {});
    await repo.finishWebhookEvent(db, workspaceId, eventId, r.status);
    return { duplicate: false, status: r.status };
  } catch (e) {
    // Stored as failed for inspection; answer 2xx so the provider doesn't retry a poison event forever.
    console.error(`[integrations] ${appId} webhook ${verified.eventType} failed:`, e);
    await repo.finishWebhookEvent(db, workspaceId, eventId, "failed", (e as Error).message.slice(0, 500));
    return { duplicate: false, status: "failed" as const };
  }
}
