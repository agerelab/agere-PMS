// Temporary access gate for a deployed staging App Center until the identity module (PRD-01)
// exists. With STAGING_PASSWORD set, every page and API call needs HTTP Basic auth with that
// password (any user name), and requests that pass run as the fixed DEV_* user and organization.
// Webhooks, cron and health stay open: providers and Vercel Cron authenticate on their own.
// Remove this file when real sessions land.

export const OPEN_PATHS = ["/api/v1/webhooks/", "/api/cron/", "/api/health"];
export const stagingEnabled = () => !!process.env.STAGING_PASSWORD;

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True when the Authorization header carries the staging password. */
export function stagingAuthorized(authorization: string | null): boolean {
  const password = process.env.STAGING_PASSWORD;
  if (!password || !authorization?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(authorization.slice(6));
  } catch {
    return false;
  }
  const i = decoded.indexOf(":");
  return i >= 0 && constantTimeEqual(decoded.slice(i + 1), password);
}
