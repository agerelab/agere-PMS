// GitHub repository listing and one-click webhook install for the connected workspace.
import type { Db } from "@/db/client";
import { HttpError, requireAdmin, type RequestContext } from "@/lib/context";
import { decryptSecret } from "@/lib/crypto/token-cipher";
import * as repo from "../repository";
import { getWorkspaceAccessToken, secretContext } from "../service";

const GH = "https://api.github.com";
const REPO_NAME = /^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/;
const headers = (t: string) => ({ authorization: `Bearer ${t}`, accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" });

export const webhookUrl = (orgId: string) => `${(process.env.APP_URL ?? "").replace(/\/$/, "")}/api/v1/webhooks/github/${orgId}`;

export async function listRepositories(db: Db, ctx: RequestContext) {
  const token = await getWorkspaceAccessToken(db, ctx.organizationId, "github");
  const res = await fetch(`${GH}/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member`, {
    headers: headers(token),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new HttpError(502, "GITHUB_ERROR", `GitHub responded ${res.status}`);
  const rows = (await res.json()) as any[];
  const ws = await repo.getWorkspaceIntegration(db, ctx, "github");
  const hooked = new Set(((ws?.settings?.repositories as string[]) ?? []).map((r) => r.toLowerCase()));
  return rows.map((r) => ({
    fullName: r.full_name as string,
    private: !!r.private,
    canInstallHook: !!r.permissions?.admin,
    hooked: hooked.has(String(r.full_name).toLowerCase()),
  }));
}

/** Installs (or reuses) the push + pull_request webhook on a repository the admin can manage. */
export async function installRepositoryHook(db: Db, ctx: RequestContext, fullName: unknown) {
  requireAdmin(ctx);
  if (typeof fullName !== "string" || !REPO_NAME.test(fullName)) throw new HttpError(422, "INVALID_REPOSITORY");
  const ws = await repo.getWorkspaceIntegration(db, ctx, "github");
  if (ws?.status !== "connected" || !ws.encryptedWebhookSecret) throw new HttpError(409, "NOT_CONNECTED");
  const token = await getWorkspaceAccessToken(db, ctx.organizationId, "github");
  const url = webhookUrl(ctx.organizationId);
  const secret = decryptSecret(ws.encryptedWebhookSecret, secretContext(ctx.organizationId, "github", "webhook"));

  const existing = await fetch(`${GH}/repos/${fullName}/hooks?per_page=100`, { headers: headers(token), signal: AbortSignal.timeout(10_000) });
  if (existing.status === 404) throw new HttpError(404, "REPOSITORY_NOT_FOUND", "Repository not found or you are not an admin of it");
  if (!existing.ok) throw new HttpError(502, "GITHUB_ERROR", `GitHub responded ${existing.status}`);
  const hooks = (await existing.json()) as any[];
  const config = { url, content_type: "json", secret, insecure_ssl: "0" };
  const body = JSON.stringify({ name: "web", active: true, events: ["push", "pull_request"], config });
  const found = hooks.find((h) => h.config?.url === url);
  const res = await fetch(found ? `${GH}/repos/${fullName}/hooks/${found.id}` : `${GH}/repos/${fullName}/hooks`, {
    method: found ? "PATCH" : "POST",
    headers: { ...headers(token), "content-type": "application/json" },
    body,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new HttpError(502, "GITHUB_ERROR", `GitHub responded ${res.status} while installing the webhook`);

  const repos = new Set([...(((ws.settings?.repositories as string[]) ?? [])), fullName]);
  await repo.updateWorkspaceSettings(db, ctx, "github", { ...ws.settings, repositories: [...repos] });
  return { repository: fullName, webhookUrl: url, updated: !!found };
}
