// RequestContext (TECH-01 P3): built before any data access and passed first to every repository.
// The identity module (PRD-01) does not exist yet. Until it does, a fixed user (DEV_* env) is
// used locally with DEV_AUTH=1, or on a staging deployment behind STAGING_PASSWORD; otherwise
// every request is unauthenticated. Replace resolveSession() when
// PRD-01 lands — nothing else in the integrations module reads auth state.
import { randomUUID } from "node:crypto";
import { stagingAuthorized } from "./staging";

export type Role = "owner" | "admin" | "member";
export type RequestContext = { requestId: string; userId: string; organizationId: string; role: Role };

export class HttpError extends Error {
  constructor(public status: number, public code: string, message?: string) {
    super(message ?? code);
  }
}

type SessionResolver = (req: Request) => Promise<Omit<RequestContext, "requestId"> | null>;

const defaultResolver: SessionResolver = async (req) => {
  // Local development (DEV_AUTH=1, never in production builds), or a password-gated staging
  // deployment (STAGING_PASSWORD, checked again here so no route can skip the gate).
  const dev = process.env.DEV_AUTH === "1" && process.env.NODE_ENV !== "production";
  if (!dev && !stagingAuthorized(req.headers.get("authorization"))) return null;
  const organizationId = process.env.DEV_ORGANIZATION_ID;
  const userId = process.env.DEV_USER_ID;
  if (!organizationId || !userId) return null;
  const role = (process.env.DEV_ROLE as Role) ?? "owner";
  return { organizationId, userId, role };
};

let resolveSession: SessionResolver = defaultResolver;

/** Identity module (or tests) plug in the real session lookup here. */
export function setSessionResolver(fn: SessionResolver) {
  resolveSession = fn;
}

export function resetSessionResolver() {
  resolveSession = defaultResolver;
}

export async function getRequestContext(req: Request): Promise<RequestContext> {
  const s = await resolveSession(req);
  if (!s) throw new HttpError(401, "UNAUTHENTICATED");
  return { ...s, requestId: req.headers.get("x-request-id") ?? randomUUID() };
}

export async function getOptionalContext(req: Request): Promise<RequestContext | null> {
  try {
    return await getRequestContext(req);
  } catch {
    return null;
  }
}

/** Kelola › Aplikasi is admin-only (PRD-04): only owners and admins connect or disconnect apps. */
export function requireAdmin(ctx: RequestContext) {
  if (ctx.role !== "owner" && ctx.role !== "admin") throw new HttpError(403, "FORBIDDEN", "Only owners and admins can manage integrations");
}
