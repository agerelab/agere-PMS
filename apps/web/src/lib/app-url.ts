/**
 * Public base URL. OAuth redirect URIs are built from it, so it must be the stable production
 * domain registered with each provider. On Vercel it falls back to the project's production
 * domain; set APP_URL explicitly once a custom domain exists.
 */
export function appUrl(): string {
  const explicit = process.env.APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  throw new Error("APP_URL is not set");
}
