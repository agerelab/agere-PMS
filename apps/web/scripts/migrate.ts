// Applies db/migrations/*.sql in order, once each (forward-only, PLAN-01 §3).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = postgres(url, { max: 1, onnotice: () => {} });
const dir = join(import.meta.dirname, "..", "db", "migrations");

await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
const done = new Set((await sql<{ name: string }[]>`SELECT name FROM schema_migrations`).map((r) => r.name));
for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(f)) continue;
  await sql.begin(async (tx) => {
    await tx.unsafe(readFileSync(join(dir, f), "utf8"));
    await tx`INSERT INTO schema_migrations (name) VALUES (${f})`;
  });
  console.log(`applied ${f}`);
}
await sql.end();
