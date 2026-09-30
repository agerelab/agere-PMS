import { getDb } from "@/db/client";
import { HttpError, getRequestContext } from "@/lib/context";
import { assertSameOrigin, handle, json, readJson } from "@/lib/http";
import { attachDriveFile, listAttachments } from "@/modules/integrations/gdrive/attachments";

type P = { params: Promise<{ taskId: string }> };

/** GET /api/v1/tasks/:taskId/attachments — Drive files, GitHub PRs and commits linked to the task. */
export const GET = handle(async (req: Request, { params }: P) => {
  const { taskId } = await params;
  const ctx = await getRequestContext(req);
  return json(await listAttachments(getDb(), ctx, taskId));
});

/** POST /api/v1/tasks/:taskId/attachments { provider: "google-drive", fileId } */
export const POST = handle(async (req: Request, { params }: P) => {
  assertSameOrigin(req);
  const { taskId } = await params;
  const ctx = await getRequestContext(req);
  const body = (await readJson(req)) as { provider?: string; fileId?: unknown };
  if (body.provider !== "google-drive") throw new HttpError(422, "UNSUPPORTED_PROVIDER");
  return json({ data: await attachDriveFile(getDb(), ctx, taskId, body.fileId) }, 201);
});
