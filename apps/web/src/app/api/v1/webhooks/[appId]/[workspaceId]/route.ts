import { getDb } from "@/db/client";
import { HttpError } from "@/lib/context";
import { handle, json } from "@/lib/http";
import { MAX_WEBHOOK_BYTES, receiveWebhook } from "@/modules/integrations/webhooks/receive";

/**
 * POST /api/v1/webhooks/:appId/:workspaceId — generic listener for provider events. Authenticated
 * per provider (GitHub HMAC-SHA256, GitLab token), recorded once per delivery id, then dispatched.
 */
export const POST = handle(async (req: Request, { params }: { params: Promise<{ appId: string; workspaceId: string }> }) => {
  const { appId, workspaceId } = await params;
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_WEBHOOK_BYTES) throw new HttpError(413, "TOO_LARGE");
  const raw = await req.text(); // raw bytes are what the signature covers
  if (raw.length > MAX_WEBHOOK_BYTES) throw new HttpError(413, "TOO_LARGE");
  const r = await receiveWebhook(getDb(), appId, workspaceId, req.headers, raw);
  return json({ received: true, ...r }, r.duplicate ? 200 : 202);
});
