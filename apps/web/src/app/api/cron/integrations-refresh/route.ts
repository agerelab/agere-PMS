import { timingSafeEqual } from "node:crypto";
import { getDb } from "@/db/client";
import { HttpError } from "@/lib/context";
import { handle, json } from "@/lib/http";
import { refreshExpiringTokens } from "@/modules/integrations/service";

export const maxDuration = 60;

/**
 * Vercel Cron (vercel.json): refresh tokens that expire within CRON_REFRESH_WINDOW_MINUTES
 * (default 10). Hobby plans run cron once a day, so set the window to 1500 there: every
 * connection is refreshed daily, and requests still refresh on demand in between.
 */
export const GET = handle(async (req: Request) => {
  const secret = process.env.CRON_SECRET;
  const got = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Bearer ${secret}`);
  if (!secret || got.length !== want.length || !timingSafeEqual(got, want)) throw new HttpError(401, "UNAUTHORIZED");
  const minutes = Number(process.env.CRON_REFRESH_WINDOW_MINUTES ?? 10);
  return json(await refreshExpiringTokens(getDb(), { windowMs: (Number.isFinite(minutes) && minutes > 0 ? minutes : 10) * 60_000 }));
});
