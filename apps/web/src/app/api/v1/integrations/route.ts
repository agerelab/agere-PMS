import { getDb } from "@/db/client";
import { getRequestContext } from "@/lib/context";
import { handle, json } from "@/lib/http";
import { listIntegrations } from "@/modules/integrations/service";

/** GET /api/v1/integrations — the catalog with this workspace's connection status. */
export const GET = handle(async (req: Request) => {
  const ctx = await getRequestContext(req);
  const items = await listIntegrations(getDb(), ctx);
  return json({ data: items, viewer: { role: ctx.role, canManage: ctx.role !== "member" } });
});
