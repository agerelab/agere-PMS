import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Db } from "@/db/client";
import { integrationTaskLinks, integrationWebhookEvents, tasks, workspaceIntegrations } from "@/db/schema";
import { setSessionResolver } from "@/lib/context";
import { encryptSecret } from "@/lib/crypto/token-cipher";
import { POST as webhookRoute } from "@/app/api/v1/webhooks/[appId]/[workspaceId]/route";
import { findTaskRefs } from "@/modules/integrations/tasks";
import { addTask, ADMIN, freshDb, OTHER_ORG, ORG, setTestEnv } from "./helpers";

const SECRET = "whsec_test";
let db: Db;

beforeEach(async () => {
  setTestEnv();
  ({ db } = await freshDb());
  setSessionResolver(async () => null); // webhooks never use a session
  await db.insert(workspaceIntegrations).values({
    organizationId: ORG,
    appId: "github",
    status: "connected",
    encryptedAccessToken: encryptSecret("gho", `${ORG}:github:access`),
    encryptedWebhookSecret: encryptSecret(SECRET, `${ORG}:github:webhook`),
    connectedBy: ADMIN,
  });
});
afterEach(() => vi.unstubAllGlobals());

function deliver(event: string, payload: unknown, opts: { delivery?: string; secret?: string; org?: string } = {}) {
  const body = JSON.stringify(payload);
  const sig = `sha256=${createHmac("sha256", opts.secret ?? SECRET).update(body).digest("hex")}`;
  const req = new Request(`https://app.agere.test/api/v1/webhooks/github/${opts.org ?? ORG}`, {
    method: "POST",
    body,
    headers: { "content-type": "application/json", "x-github-event": event, "x-github-delivery": opts.delivery ?? crypto.randomUUID(), "x-hub-signature-256": sig },
  });
  return webhookRoute(req, { params: Promise.resolve({ appId: "github", workspaceId: opts.org ?? ORG }) });
}

const repository = { full_name: "agere/app", default_branch: "main" };
const statusOf = async (id: string) => (await db.select().from(tasks)).find((t) => t.id === id)!.status;

describe("task key parsing", () => {
  it("finds keys in messages, titles and branch names", () => {
    expect(findTaskRefs("Fix login (AGR-12) and web-7", "feature/AGR-99-x", null)).toEqual(["AGR-12", "WEB-7", "AGR-99"]);
    expect(findTaskRefs("utf-8 and ISO-8601 dates")).toEqual(["UTF-8", "ISO-8601"]); // harmless: no such task keys exist
  });
});

describe("GitHub webhook", () => {
  it("links a pull request to the tasks it mentions and moves them to review, then to done on merge", async () => {
    const a = await addTask(db, "AGR-12");
    const b = await addTask(db, "AGR-13");
    const pr = { number: 7, title: "AGR-12: checkout fix", body: "Also touches AGR-13", html_url: "https://github.com/agere/app/pull/7", state: "open", draft: false, merged: false, head: { ref: "fix/checkout" }, base: { ref: "main" }, user: { login: "octo" } };
    let res = await deliver("pull_request", { action: "opened", pull_request: pr, repository });
    expect(res.status).toBe(202);
    expect(await res.json()).toMatchObject({ status: "processed" });
    expect(await statusOf(a)).toBe("in_review");
    const links = await db.select().from(integrationTaskLinks);
    expect(links).toHaveLength(2);
    expect(links[0]).toMatchObject({ kind: "github_pull_request", externalId: "agere/app#7", url: pr.html_url });

    res = await deliver("pull_request", { action: "closed", pull_request: { ...pr, state: "closed", merged: true }, repository });
    expect(await statusOf(a)).toBe("done");
    expect(await statusOf(b)).toBe("done");
    // one link per PR per task, updated in place
    const after = await db.select().from(integrationTaskLinks);
    expect(after).toHaveLength(2);
    expect(after[0].metadata).toMatchObject({ state: "merged" });
  });

  it("links commits, starts work on mentioned tasks and closes them from the default branch", async () => {
    const a = await addTask(db, "AGR-20");
    const b = await addTask(db, "AGR-21");
    await deliver("push", {
      ref: "refs/heads/main",
      repository,
      commits: [
        { id: "c1", message: "Fixes AGR-20: null check\n\nlong body", url: "https://github.com/agere/app/commit/c1", author: { username: "octo" } },
        { id: "c2", message: "WIP on AGR-21", url: "https://github.com/agere/app/commit/c2", author: { username: "octo" } },
      ],
    });
    expect(await statusOf(a)).toBe("done");
    expect(await statusOf(b)).toBe("in_progress");
    const links = await db.select().from(integrationTaskLinks);
    expect(links.map((l) => l.title).sort()).toEqual(["Fixes AGR-20: null check", "WIP on AGR-21"]);
  });

  it("does not close tasks from a feature branch", async () => {
    const a = await addTask(db, "AGR-30");
    await deliver("push", { ref: "refs/heads/feature/x", repository, commits: [{ id: "c9", message: "closes AGR-30", url: "u" }] });
    expect(await statusOf(a)).toBe("in_progress");
  });

  it("never moves a finished task backwards", async () => {
    const a = await addTask(db, "AGR-40");
    await db.update(tasks).set({ status: "done" });
    await deliver("pull_request", { action: "reopened", pull_request: { number: 1, title: "AGR-40", state: "open", draft: false, head: { ref: "x" } }, repository });
    expect(await statusOf(a)).toBe("done");
  });

  it("respects statusSync=false: links only", async () => {
    await db.update(workspaceIntegrations).set({ settings: { statusSync: false } });
    const a = await addTask(db, "AGR-50");
    await deliver("pull_request", { action: "opened", pull_request: { number: 2, title: "AGR-50", state: "open", draft: false, head: { ref: "x" } }, repository });
    expect(await statusOf(a)).toBe("todo");
    expect(await db.select().from(integrationTaskLinks)).toHaveLength(1);
  });

  it("rejects a bad signature", async () => {
    const res = await deliver("push", { ref: "refs/heads/main", repository, commits: [] }, { secret: "wrong" });
    expect(res.status).toBe(401);
    expect(await db.select().from(integrationWebhookEvents)).toHaveLength(0);
  });

  it("processes a redelivered event once", async () => {
    const a = await addTask(db, "AGR-60");
    const payload = { action: "opened", pull_request: { number: 3, title: "AGR-60", state: "open", draft: false, head: { ref: "x" } }, repository };
    expect((await deliver("pull_request", payload, { delivery: "d-1" })).status).toBe(202);
    const dup = await deliver("pull_request", payload, { delivery: "d-1" });
    expect(dup.status).toBe(200);
    expect(await dup.json()).toMatchObject({ duplicate: true });
    expect(await db.select().from(integrationWebhookEvents)).toHaveLength(1);
    expect(await statusOf(a)).toBe("in_review");
  });

  it("answers 404 for a workspace without the integration and never touches its tasks", async () => {
    await addTask(db, "AGR-70", "other org task", OTHER_ORG);
    const res = await deliver("pull_request", { action: "opened", pull_request: { number: 4, title: "AGR-70", state: "open", head: { ref: "x" } }, repository }, { org: OTHER_ORG });
    expect(res.status).toBe(404);
  });

  it("records unhandled events as ignored", async () => {
    const res = await deliver("ping", { zen: "Keep it simple." });
    expect(await res.json()).toMatchObject({ status: "ignored" });
    const [ev] = await db.select().from(integrationWebhookEvents);
    expect(ev).toMatchObject({ eventType: "ping", status: "ignored" });
  });
});
