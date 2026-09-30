import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Db } from "@/db/client";
import { integrationTaskLinks, userIntegrations, workspaceIntegrations } from "@/db/schema";
import { encryptSecret } from "@/lib/crypto/token-cipher";
import { attachDriveFile, listAttachments, pickerSession, removeAttachment } from "@/modules/integrations/gdrive/attachments";
import { completeOAuthCallback, disconnect, startConnect } from "@/modules/integrations/service";
import { addTask, ADMIN, adminCtx, freshDb, jsonRes, MEMBER, memberCtx, mockFetch, ORG, setTestEnv } from "./helpers";

let db: Db;
const FILE = "1AbCdEfGhIjKlMnOpQrStUv";

beforeEach(async () => {
  setTestEnv();
  ({ db } = await freshDb());
  await db.insert(workspaceIntegrations).values({
    organizationId: ORG,
    appId: "google-drive",
    status: "connected",
    encryptedAccessToken: encryptSecret("admin-token", `${ORG}:google-drive:access`),
    encryptedRefreshToken: encryptSecret("admin-refresh", `${ORG}:google-drive:refresh`),
    tokenExpiresAt: new Date(Date.now() + 3600_000),
    connectedBy: ADMIN,
  });
});
afterEach(() => vi.unstubAllGlobals());

const driveFile = { id: FILE, name: "Brief Q4.pdf", mimeType: "application/pdf", webViewLink: `https://drive.google.com/file/d/${FILE}/view`, size: "2048" };

describe("Google Drive picker + attachments", () => {
  it("gives the connecting admin a picker session with their own token", async () => {
    expect(await pickerSession(db, adminCtx)).toMatchObject({ accessToken: "admin-token", apiKey: "picker-key", appId: "1234567890" });
  });

  it("never hands the admin's Drive token to another member", async () => {
    await expect(pickerSession(db, memberCtx)).rejects.toMatchObject({ code: "PERSONAL_CONNECTION_REQUIRED" });
  });

  it("lets a member connect a personal Google account and use it", async () => {
    const { url } = await startConnect(db, memberCtx, "google-drive", { personal: true });
    mockFetch([
      { match: (u) => u === "https://oauth2.googleapis.com/token", respond: () => jsonRes({ access_token: "member-token", refresh_token: "mr", expires_in: 3600 }) },
      { match: (u) => u.includes("openidconnect"), respond: () => jsonRes({ sub: "m", email: "member@example.com" }) },
    ]);
    expect(await completeOAuthCallback(db, "google-drive", { state: new URL(url).searchParams.get("state"), code: "c", error: null }, memberCtx)).toMatchObject({ ok: true });
    expect(await pickerSession(db, memberCtx)).toMatchObject({ accessToken: "member-token" });
    // the workspace row is untouched
    const [ws] = await db.select().from(workspaceIntegrations);
    expect(ws.connectedBy).toBe(ADMIN);
  });

  it("refuses personal connections before an admin connects the workspace", async () => {
    await db.delete(workspaceIntegrations);
    await expect(startConnect(db, memberCtx, "google-drive", { personal: true })).rejects.toMatchObject({ code: "WORKSPACE_NOT_CONNECTED" });
  });

  it("attaches a picked file to a task using Drive metadata", async () => {
    const taskId = await addTask(db, "AGR-1");
    const calls = mockFetch([{ match: (u) => u.startsWith(`https://www.googleapis.com/drive/v3/files/${FILE}?`), respond: () => jsonRes(driveFile) }]);
    const link = await attachDriveFile(db, adminCtx, taskId, FILE);
    expect(new Headers(calls[0].init?.headers).get("authorization")).toBe("Bearer admin-token");
    expect(link).toMatchObject({ kind: "google_drive_file", title: "Brief Q4.pdf", url: driveFile.webViewLink, metadata: { mimeType: "application/pdf", size: 2048 } });
    // attaching the same file again updates the one link
    await attachDriveFile(db, adminCtx, taskId, FILE);
    expect((await listAttachments(db, adminCtx, taskId)).links).toHaveLength(1);
    await removeAttachment(db, adminCtx, taskId, link.id);
    expect(await db.select().from(integrationTaskLinks)).toHaveLength(0);
  });

  it("rejects file ids that could alter the Drive URL", async () => {
    const taskId = await addTask(db, "AGR-2");
    mockFetch([]);
    await expect(attachDriveFile(db, adminCtx, taskId, "../../about?x=")).rejects.toMatchObject({ code: "INVALID_FILE_ID" });
  });

  it("reports files the user did not pick (drive.file hides them) as not accessible", async () => {
    const taskId = await addTask(db, "AGR-3");
    mockFetch([{ match: () => true, respond: () => jsonRes({ error: { code: 404 } }, 404) }]);
    await expect(attachDriveFile(db, adminCtx, taskId, FILE)).rejects.toMatchObject({ code: "FILE_NOT_ACCESSIBLE" });
  });

  it("404s tasks from another workspace", async () => {
    const other = await addTask(db, "AGR-4", "x", "00000000-0000-7000-8000-00000000000b");
    await expect(listAttachments(db, adminCtx, other)).rejects.toMatchObject({ status: 404 });
  });

  it("drops personal connections when the workspace disconnects", async () => {
    await db.insert(userIntegrations).values({ organizationId: ORG, userId: MEMBER, appId: "google-drive", status: "connected", encryptedAccessToken: encryptSecret("m", `${ORG}:google-drive:user:${MEMBER}:access`) });
    mockFetch([{ match: (u) => u === "https://oauth2.googleapis.com/revoke", respond: () => new Response(null, { status: 200 }) }]);
    await disconnect(db, adminCtx, "google-drive");
    expect(await db.select().from(userIntegrations)).toHaveLength(0);
  });
});
