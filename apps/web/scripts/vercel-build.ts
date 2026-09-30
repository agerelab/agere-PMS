// Vercel build entry (package.json "vercel-build"): migrate, then build.
// Migrations run only for production deployments, so a preview build never changes the
// production schema. Previews that need a schema use their own DATABASE_URL (e.g. a Neon branch)
// with MIGRATE_ON_BUILD=1.
import { execSync } from "node:child_process";

const production = process.env.VERCEL_ENV === "production";
const migrate = process.env.MIGRATE_ON_BUILD === "1" || (production && process.env.MIGRATE_ON_BUILD !== "0");

if (migrate) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set; cannot run migrations for this deployment.");
    process.exit(1);
  }
  execSync("tsx scripts/migrate.ts", { stdio: "inherit" });
} else {
  console.log(`Skipping migrations (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}).`);
}
execSync("next build", { stdio: "inherit" });
