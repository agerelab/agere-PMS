import { getDb } from "@/db/client";
import { getRequestContext } from "@/lib/context";
import { assertSameOrigin, handle, json } from "@/lib/http";
import { disconnect } from "@/modules/integrations/service";

/**
 * POST /api/v1/integrations/:appId/disconnect — revokes at the provider where possible, deletes
 * the tokens and marks the connection disconnected. ?personal=1 removes only the member's own
 * account connection.
 */
export const POST = handle(async (req: Request, { params }: { params: Promise<{ appId: string }> }) => {
  assertSameOrigin(req);
  const { appId } = await params;
  const ctx = await getRequestContext(req);
  await disconnect(getDb(), ctx, appId, { personal: new URL(req.url).searchParams.get("personal") === "1" });
  return json({ status: "disconnected" });
});
