import { getDb } from "@/db/client";
import { appUrl } from "@/lib/app-url";
import { getOptionalContext } from "@/lib/context";
import { handle } from "@/lib/http";
import { completeOAuthCallback } from "@/modules/integrations/service";

/**
 * GET /api/v1/integrations/:appId/callback — the provider redirects here. Validates and consumes
 * the state, exchanges the code, stores the tokens encrypted, then sends the browser back to the
 * App Center with ?integration=<app>&result=connected|error&code=<reason>.
 */
export const GET = handle(async (req: Request, { params }: { params: Promise<{ appId: string }> }) => {
  const { appId } = await params;
  const q = new URL(req.url).searchParams;
  const r = await completeOAuthCallback(getDb(), appId, { state: q.get("state"), code: q.get("code"), error: q.get("error") }, await getOptionalContext(req));
  const back = new URL(r.redirectTo, appUrl());
  back.searchParams.set("integration", appId);
  back.searchParams.set("result", r.ok ? "connected" : "error");
  if (!r.ok) back.searchParams.set("code", r.code);
  return new Response(null, { status: 303, headers: { location: back.toString(), "cache-control": "no-store" } });
});
