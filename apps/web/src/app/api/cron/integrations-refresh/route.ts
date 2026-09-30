import { timingSafeEqual } from "node:crypto";
import { getDb } from "@/db/client";
import { HttpError } from "@/lib/context";
import { handle, json } from "@/lib/http";
import { refreshExpiringTokens } from "@/modules/integrations/service";

export const maxDuration = 60;

/** Vercel Cron (every 5 minutes, see vercel.json): refresh tokens that expire within 10 minutes. */
export const GET = handle(async (req: Request) => {
  const secret = process.env.CRON_SECRET;
  const got = Buffer.from(req.headers.get("authorization") ?? "");
  const want = Buffer.from(`Bearer ${secret}`);
  if (!secret || got.length !== want.length || !timingSafeEqual(got, want)) throw new HttpError(401, "UNAUTHORIZED");
  return json(await refreshExpiringTokens(getDb()));
});
