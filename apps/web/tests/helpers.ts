import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { vi } from "vitest";
import { setDbForTests, type Db } from "@/db/client";
import * as schema from "@/db/schema";
import type { RequestContext } from "@/lib/context";
import { uuidv7 } from "@/lib/ids";

export const ORG = "00000000-0000-7000-8000-00000000000a";
export const OTHER_ORG = "00000000-0000-7000-8000-00000000000b";
export const ADMIN = "00000000-0000-7000-8000-0000000000a1";
export const MEMBER = "00000000-0000-7000-8000-0000000000a2";

export const adminCtx: RequestContext = { requestId: "r", organizationId: ORG, userId: ADMIN, role: "admin" };
export const memberCtx: RequestContext = { requestId: "r", organizationId: ORG, userId: MEMBER, role: "member" };

export function setTestEnv() {
  Object.assign(process.env, {
    APP_URL: "https://app.agere.test",
    INTEGRATION_ENCRYPTION_KEY_ID: "k1",
    INTEGRATION_ENCRYPTION_KEYS: `k1:${Buffer.alloc(32, 7).toString("base64")}`,
    GITHUB_CLIENT_ID: "gh-client",
    GITHUB_CLIENT_SECRET: "gh-secret",
    GOOGLE_CLIENT_ID: "g-client",
    GOOGLE_CLIENT_SECRET: "g-secret",
    GOOGLE_PICKER_API_KEY: "picker-key",
    GOOGLE_CLOUD_PROJECT_NUMBER: "1234567890",
    CRON_SECRET: "cron-secret",
  });
}

export async function freshDb(): Promise<{ db: Db; pg: PGlite }> {
  const pg = new PGlite();
  await pg.exec(readFileSync(join(import.meta.dirname, "..", "db", "migrations", "0001_app_center.sql"), "utf8"));
  const db = drizzle(pg, { schema }) as unknown as Db;
  setDbForTests(db);
  return { db, pg };
}

export async function addTask(db: Db, ref: string, title = `Task ${ref}`, orgId = ORG) {
  const id = uuidv7();
  await db.insert(schema.tasks).values({ organizationId: orgId, id, ref, title });
  return id;
}

type Route = { match: (url: string, init?: RequestInit) => boolean; respond: (url: string, init?: RequestInit) => Response | Promise<Response> };

/** Replaces global fetch; unmatched requests fail the test loudly instead of hitting the network. */
export function mockFetch(routes: Route[]) {
  const calls: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    calls.push({ url, init });
    const r = routes.find((x) => x.match(url, init));
    if (!r) throw new Error(`unexpected fetch ${init?.method ?? "GET"} ${url}`);
    return r.respond(url, init);
  });
  return calls;
}

export const jsonRes = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
export const bodyOf = (init?: RequestInit) => new URLSearchParams(String(init?.body ?? ""));
