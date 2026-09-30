import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/** Any Drizzle Postgres database (postgres-js in the app, PGlite in tests). */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

let db: Db | undefined;
let override: Db | undefined;

export function getDb(): Db {
  if (override) return override;
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    // Serverless: few connections per instance, and no prepared statements so the app works
    // behind transaction-mode poolers (Neon pooler, Supabase Supavisor/PgBouncer).
    db = drizzle(postgres(url, { max: 5, prepare: false, idle_timeout: 20, connect_timeout: 10 }), { schema }) as unknown as Db;
  }
  return db;
}

/** Tests swap in a PGlite database. */
export function setDbForTests(d: Db | undefined) {
  override = d;
}
