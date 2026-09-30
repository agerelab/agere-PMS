// Standalone token refresh worker for hosts without Vercel Cron (Docker, a VM, Railway…).
// Runs the same job as /api/cron/integrations-refresh every minute. Several copies can run at
// once: rows are claimed with SELECT … FOR UPDATE SKIP LOCKED.
import { refreshExpiringTokens } from "../src/modules/integrations/service";
import { getDb } from "../src/db/client";

const INTERVAL_MS = Number(process.env.REFRESH_INTERVAL_MS ?? 60_000);
let stopping = false;
process.on("SIGTERM", () => (stopping = true));
process.on("SIGINT", () => (stopping = true));

while (!stopping) {
  try {
    const r = await refreshExpiringTokens(getDb());
    if (r.checked) console.log(`[refresh-worker] checked=${r.checked} refreshed=${r.refreshed} failed=${r.failed}`);
  } catch (e) {
    console.error("[refresh-worker]", e);
  }
  await new Promise((res) => setTimeout(res, INTERVAL_MS));
}
process.exit(0);
