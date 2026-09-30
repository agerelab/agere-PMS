import { getDb } from "@/db/client";
import { getRequestContext } from "@/lib/context";
import { assertSameOrigin, handle, json, readJson } from "@/lib/http";
import { installRepositoryHook, listRepositories } from "@/modules/integrations/github/repositories";

/** GET /api/v1/integrations/github/repositories — repositories the connected account can see. */
export const GET = handle(async (req: Request) => {
  const ctx = await getRequestContext(req);
  return json({ data: await listRepositories(getDb(), ctx) });
});

/** POST /api/v1/integrations/github/repositories { repository: "owner/name" } — install the task webhook. */
export const POST = handle(async (req: Request) => {
  assertSameOrigin(req);
  const ctx = await getRequestContext(req);
  const body = (await readJson(req)) as { repository?: unknown };
  return json(await installRepositoryHook(getDb(), ctx, body.repository), 201);
});
