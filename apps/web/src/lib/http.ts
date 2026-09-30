import { appUrl } from "./app-url";
import { HttpError } from "./context";
import { TokenCipherError } from "./crypto/token-cipher";

export const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });

/** Wraps a route handler: HttpError → its status, anything else → 500 without leaking details. */
export function handle<A extends unknown[]>(fn: (...a: A) => Promise<Response>) {
  return async (...a: A): Promise<Response> => {
    try {
      return await fn(...a);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: { code: e.code, message: e.message } }, e.status);
      if (e instanceof TokenCipherError) console.error("[integrations] cipher error:", e.message);
      else console.error("[integrations]", e);
      return json({ error: { code: "INTERNAL", message: "Something went wrong" } }, 500);
    }
  };
}

/** Cookie-session writes must come from our own pages (CSRF); webhooks and cron don't use this. */
export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return; // non-browser clients (curl, server-to-server) send no Origin
  let allowed: string;
  try {
    allowed = new URL(appUrl()).origin;
  } catch {
    allowed = new URL(req.url).origin;
  }
  if (origin !== allowed) throw new HttpError(403, "BAD_ORIGIN");
}

export async function readJson(req: Request, maxBytes = 16 * 1024): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "TOO_LARGE");
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "BAD_JSON");
  }
}
