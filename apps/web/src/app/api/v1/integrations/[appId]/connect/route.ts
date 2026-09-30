import { getDb } from "@/db/client";
import { getRequestContext } from "@/lib/context";
import { assertSameOrigin, handle, json, readJson } from "@/lib/http";
import { connectWithApiKey, startConnect } from "@/modules/integrations/service";

type P = { params: Promise<{ appId: string }> };

/**
 * GET /api/v1/integrations/:appId/connect — OAuth apps: returns { url } to the provider's consent
 * screen, with a single-use state (and PKCE where supported). ?redirect=1 answers with a 302
 * instead; ?personal=1 connects the member's own account (Google Drive); ?return_to=/path.
 */
export const GET = handle(async (req: Request, { params }: P) => {
  const { appId } = await params;
  const ctx = await getRequestContext(req);
  const q = new URL(req.url).searchParams;
  const { url, expiresInSeconds } = await startConnect(getDb(), ctx, appId, { personal: q.get("personal") === "1", redirectTo: q.get("return_to") ?? undefined });
  if (q.get("redirect") === "1") return Response.redirect(url, 302);
  return json({ url, expiresInSeconds });
});

/** POST /api/v1/integrations/:appId/connect — API-key apps (Toggl Track, Clockify, Zendesk). */
export const POST = handle(async (req: Request, { params }: P) => {
  assertSameOrigin(req);
  const { appId } = await params;
  const ctx = await getRequestContext(req);
  await connectWithApiKey(getDb(), ctx, appId, await readJson(req));
  return json({ status: "connected" });
});
