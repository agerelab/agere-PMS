import { getDb } from "@/db/client";
import { getRequestContext } from "@/lib/context";
import { assertSameOrigin, handle } from "@/lib/http";
import { removeAttachment } from "@/modules/integrations/gdrive/attachments";

/** DELETE /api/v1/tasks/:taskId/attachments/:linkId — removes the link, not the file. */
export const DELETE = handle(async (req: Request, { params }: { params: Promise<{ taskId: string; linkId: string }> }) => {
  assertSameOrigin(req);
  const { taskId, linkId } = await params;
  const ctx = await getRequestContext(req);
  await removeAttachment(getDb(), ctx, taskId, linkId);
  return new Response(null, { status: 204 });
});
