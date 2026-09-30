// GitHub webhook handling: link commits and pull requests to the tasks they mention, and move
// those tasks forward. Task keys (AGR-12) are read from commit messages, PR titles, bodies and
// branch names — the same convention ClickUp and Linear use.
import type { Db } from "@/db/client";
import { upsertTaskLink } from "../repository";
import { advanceTaskStatus, findTaskRefs, getTasksByRefs } from "../tasks";

export type HandleResult = { status: "processed" | "ignored"; linked: number; moved: number };

/** "fixes AGR-12", "closes AGR-12", "resolves AGR-12" (GitHub's closing keywords). */
const CLOSING = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s+([A-Z][A-Z0-9]{1,9}-\d{1,7})\b/gi;
const closingRefs = (text: string) => new Set([...text.matchAll(CLOSING)].map((m) => m[1].toUpperCase()));

export async function handleGithubEvent(db: Db, orgId: string, eventType: string, payload: any, settings: Record<string, unknown>): Promise<HandleResult> {
  const statusSync = settings.statusSync !== false; // on unless an admin turned it off
  if (eventType === "push") return handlePush(db, orgId, payload, statusSync);
  if (eventType === "pull_request") return handlePullRequest(db, orgId, payload, statusSync);
  return { status: "ignored", linked: 0, moved: 0 };
}

async function handlePush(db: Db, orgId: string, p: any, statusSync: boolean): Promise<HandleResult> {
  const repo: string = p.repository?.full_name ?? "";
  const branch = String(p.ref ?? "").replace(/^refs\/heads\//, "");
  const onDefault = !!p.repository?.default_branch && branch === p.repository.default_branch;
  const commits: any[] = Array.isArray(p.commits) ? p.commits.slice(0, 100) : [];
  let linked = 0;
  let moved = 0;
  for (const c of commits) {
    const message = String(c.message ?? "");
    const tasks = await getTasksByRefs(db, orgId, findTaskRefs(message, branch));
    const closes = closingRefs(message);
    for (const t of tasks) {
      await upsertTaskLink(db, orgId, {
        taskId: t.id,
        appId: "github",
        kind: "github_commit",
        externalId: String(c.id),
        url: String(c.url ?? ""),
        title: message.split("\n")[0].slice(0, 300),
        metadata: { repository: repo, branch, author: c.author?.username ?? c.author?.name ?? null, timestamp: c.timestamp ?? null },
      });
      linked++;
      if (!statusSync) continue;
      // A closing keyword on the default branch finishes the task; any other mention means work started.
      if (onDefault && closes.has(t.ref)) moved += +(await advanceTaskStatus(db, orgId, t, "done"));
      else moved += +(await advanceTaskStatus(db, orgId, t, "in_progress"));
    }
  }
  return { status: linked ? "processed" : "ignored", linked, moved };
}

async function handlePullRequest(db: Db, orgId: string, p: any, statusSync: boolean): Promise<HandleResult> {
  const pr = p.pull_request;
  if (!pr) return { status: "ignored", linked: 0, moved: 0 };
  const repo: string = p.repository?.full_name ?? "";
  const tasks = await getTasksByRefs(db, orgId, findTaskRefs(pr.title, pr.body, pr.head?.ref));
  const merged = p.action === "closed" && pr.merged === true;
  const state = merged ? "merged" : pr.state === "closed" ? "closed" : pr.draft ? "draft" : "open";
  let moved = 0;
  for (const t of tasks) {
    await upsertTaskLink(db, orgId, {
      taskId: t.id,
      appId: "github",
      kind: "github_pull_request",
      externalId: `${repo}#${pr.number}`,
      url: String(pr.html_url ?? ""),
      title: String(pr.title ?? "").slice(0, 300),
      metadata: { repository: repo, number: pr.number, state, author: pr.user?.login ?? null, headRef: pr.head?.ref ?? null, baseRef: pr.base?.ref ?? null },
    });
    if (!statusSync) continue;
    if (merged) moved += +(await advanceTaskStatus(db, orgId, t, "done"));
    else if (state === "open" && ["opened", "reopened", "ready_for_review", "edited", "synchronize"].includes(p.action)) {
      moved += +(await advanceTaskStatus(db, orgId, t, "in_review"));
    } else if (state === "draft") moved += +(await advanceTaskStatus(db, orgId, t, "in_progress"));
  }
  return { status: tasks.length ? "processed" : "ignored", linked: tasks.length, moved };
}
