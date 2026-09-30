import { sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { appUrl } from "@/lib/app-url";
import { encryptSecret, decryptSecret } from "@/lib/crypto/token-cipher";
import { PROVIDERS, isConfigured } from "@/modules/integrations/providers/registry";

export const dynamic = "force-dynamic";

/**
 * GET /api/health — deployment check. Reports only booleans and app ids, never values.
 * 200 when the database is reachable and migrated and encryption works; 503 otherwise.
 */
export async function GET() {
  const check = async (fn: () => Promise<unknown> | unknown) => {
    try {
      await fn();
      return true;
    } catch {
      return false;
    }
  };
  const database = await check(() => getDb().execute(sql`select 1 from integration_apps limit 1`));
  const encryption = await check(() => {
    if (decryptSecret(encryptSecret("ping", "health"), "health") !== "ping") throw new Error();
  });
  const appUrlSet = await check(() => appUrl());
  const ok = database && encryption && appUrlSet;
  return Response.json(
    {
      ok,
      checks: { database, encryption, appUrl: appUrlSet, cronSecret: !!process.env.CRON_SECRET, stagingGate: !!process.env.STAGING_PASSWORD },
      configuredApps: Object.entries(PROVIDERS)
        .filter(([, p]) => isConfigured(p))
        .map(([id]) => id),
    },
    { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } },
  );
}
