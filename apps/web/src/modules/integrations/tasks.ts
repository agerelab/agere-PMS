// TaskGateway: the only place the integrations module touches tasks. It reads the placeholder
// `tasks` table today; when the space module (PRD-06) lands, this becomes a call into
// space.getTasksByRefs / space.advanceTaskStatus and the module stops reading the table directly.
import { and, eq, inArray } from "drizzle-orm";
import type { Db } from "@/db/client";
import { tasks, type TaskStatus } from "@/db/schema";

export type TaskRow = { id: string; ref: string; title: string; status: TaskStatus };

const RANK: Record<TaskStatus, number> = { todo: 0, in_progress: 1, in_review: 2, done: 3 };

/** Task keys as people type them in commits, branches and PR titles: AGR-12, WEB-7. */
export const TASK_REF = /\b([A-Z][A-Z0-9]{1,9}-\d{1,7})\b/g;

export function findTaskRefs(...texts: (string | null | undefined)[]): string[] {
  const out = new Set<string>();
  for (const t of texts) for (const m of (t ?? "").toUpperCase().matchAll(TASK_REF)) out.add(m[1]);
  return [...out];
}

export async function getTasksByRefs(db: Db, orgId: string, refs: string[]): Promise<TaskRow[]> {
  if (!refs.length) return [];
  return db
    .select({ id: tasks.id, ref: tasks.ref, title: tasks.title, status: tasks.status })
    .from(tasks)
    .where(and(eq(tasks.organizationId, orgId), inArray(tasks.ref, refs.slice(0, 50))));
}

export async function getTask(db: Db, orgId: string, taskId: string): Promise<TaskRow | undefined> {
  return (
    await db
      .select({ id: tasks.id, ref: tasks.ref, title: tasks.title, status: tasks.status })
      .from(tasks)
      .where(and(eq(tasks.organizationId, orgId), eq(tasks.id, taskId)))
      .limit(1)
  )[0];
}

/** Moves a task forward only (todo → in progress → in review → done); never reopens it. */
export async function advanceTaskStatus(db: Db, orgId: string, task: TaskRow, to: TaskStatus): Promise<boolean> {
  if (RANK[to] <= RANK[task.status]) return false;
  await db.update(tasks).set({ status: to, updatedAt: new Date() }).where(and(eq(tasks.organizationId, orgId), eq(tasks.id, task.id)));
  task.status = to;
  return true;
}
