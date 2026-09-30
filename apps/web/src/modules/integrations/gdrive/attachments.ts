// Google Drive attachments on tasks. The browser picks a file with the Google Picker using the
// member's own short-lived token; the server then reads the file's metadata with that same
// account (drive.file scope grants access to picked files only) and stores the link.
import type { Db } from "@/db/client";
import { HttpError, type RequestContext } from "@/lib/context";
import * as repo from "../repository";
import { getPersonalAccessToken } from "../service";
import { getTask } from "../tasks";

const FILE_ID = /^[A-Za-z0-9_-]{10,200}$/;

export async function pickerSession(db: Db, ctx: RequestContext) {
  const apiKey = process.env.GOOGLE_PICKER_API_KEY;
  const appId = process.env.GOOGLE_CLOUD_PROJECT_NUMBER;
  if (!apiKey || !appId) throw new HttpError(409, "NOT_CONFIGURED", "Google Picker is not configured on the server");
  const { token, expiresAt } = await getPersonalAccessToken(db, ctx, "google-drive");
  return { accessToken: token, expiresAt: expiresAt?.toISOString() ?? null, apiKey, appId };
}

async function requireTask(db: Db, ctx: RequestContext, taskId: string) {
  // TODO(PRD-04): replace with authz.can(ctx, 'view', task) once the space module owns tasks.
  const task = /^[0-9a-f-]{36}$/i.test(taskId) ? await getTask(db, ctx.organizationId, taskId) : undefined;
  if (!task) throw new HttpError(404, "TASK_NOT_FOUND");
  return task;
}

export async function listAttachments(db: Db, ctx: RequestContext, taskId: string) {
  const task = await requireTask(db, ctx, taskId);
  const links = await repo.listTaskLinks(db, ctx, taskId);
  return {
    task,
    links: links.map((l) => ({ id: l.id, appId: l.appId, kind: l.kind, url: l.url, title: l.title, metadata: l.metadata, createdAt: l.createdAt.toISOString() })),
  };
}

export async function attachDriveFile(db: Db, ctx: RequestContext, taskId: string, fileId: unknown) {
  await requireTask(db, ctx, taskId);
  if (typeof fileId !== "string" || !FILE_ID.test(fileId)) throw new HttpError(422, "INVALID_FILE_ID");
  const { token } = await getPersonalAccessToken(db, ctx, "google-drive");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,webViewLink,iconLink,size,modifiedTime&supportsAllDrives=true`,
    { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) },
  );
  // 404 also covers "not picked by this user": drive.file hides files the app wasn't given.
  if (res.status === 404 || res.status === 403) throw new HttpError(404, "FILE_NOT_ACCESSIBLE", "The file was not found or was not shared with agere");
  if (!res.ok) throw new HttpError(502, "GOOGLE_ERROR", `Google Drive responded ${res.status}`);
  const f = (await res.json()) as { id: string; name: string; mimeType: string; webViewLink?: string; iconLink?: string; size?: string; modifiedTime?: string };
  const link = await repo.upsertTaskLink(db, ctx.organizationId, {
    taskId,
    appId: "google-drive",
    kind: "google_drive_file",
    externalId: f.id,
    url: f.webViewLink ?? `https://drive.google.com/file/d/${f.id}/view`,
    title: f.name.slice(0, 300),
    metadata: { mimeType: f.mimeType, iconLink: f.iconLink ?? null, size: f.size ? Number(f.size) : null, modifiedTime: f.modifiedTime ?? null },
    createdBy: ctx.userId,
  });
  return { id: link.id, appId: link.appId, kind: link.kind, url: link.url, title: link.title, metadata: link.metadata, createdAt: link.createdAt.toISOString() };
}

export async function removeAttachment(db: Db, ctx: RequestContext, taskId: string, linkId: string) {
  await requireTask(db, ctx, taskId);
  if (!(await repo.deleteTaskLink(db, ctx, taskId, linkId))) throw new HttpError(404, "LINK_NOT_FOUND");
}
