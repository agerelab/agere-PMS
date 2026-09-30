// Generic OAuth 2.0 authorization-code client (RFC 6749 + PKCE, RFC 7636) shared by every provider.
import { createHash, randomBytes } from "node:crypto";
import { oauthCredentials, type OAuthProvider } from "./registry";

export type TokenSet = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scope: string | null;
  raw: Record<string, unknown>;
};

export class OAuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");
export const sha256 = (v: string) => createHash("sha256").update(v).digest("base64url");

export function redirectUri(appId: string) {
  const base = process.env.APP_URL;
  if (!base) throw new OAuthError("NOT_CONFIGURED", "APP_URL is not set");
  return `${base.replace(/\/$/, "")}/api/v1/integrations/${appId}/callback`;
}

export function buildAuthorizeUrl(appId: string, p: OAuthProvider, state: string, codeVerifier: string | null) {
  const creds = oauthCredentials(p);
  if (!creds) throw new OAuthError("NOT_CONFIGURED", `${appId} has no OAuth credentials`);
  const u = new URL(p.authorizeUrl);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", creds.clientId);
  u.searchParams.set("redirect_uri", redirectUri(appId));
  u.searchParams.set("state", state);
  if (p.scopes.length) u.searchParams.set("scope", p.scopes.join(p.scopeSeparator ?? " "));
  if (p.pkce && codeVerifier) {
    u.searchParams.set("code_challenge", sha256(codeVerifier));
    u.searchParams.set("code_challenge_method", "S256");
  }
  for (const [k, v] of Object.entries(p.extraAuthParams ?? {})) u.searchParams.set(k, v);
  return u.toString();
}

async function tokenRequest(p: OAuthProvider, url: string, params: Record<string, string>): Promise<TokenSet> {
  const creds = oauthCredentials(p);
  if (!creds) throw new OAuthError("NOT_CONFIGURED", "OAuth credentials are not configured");
  const body = new URLSearchParams(params);
  const headers: Record<string, string> = { accept: "application/json", "content-type": "application/x-www-form-urlencoded" };
  if (p.clientAuth === "basic") {
    headers.authorization = `Basic ${Buffer.from(`${encodeURIComponent(creds.clientId)}:${encodeURIComponent(creds.clientSecret)}`).toString("base64")}`;
  } else {
    body.set("client_id", creds.clientId);
    body.set("client_secret", creds.clientSecret);
  }
  const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(15_000) });
  let data: Record<string, any> = {};
  try {
    data = await res.json();
  } catch {
    throw new OAuthError("BAD_TOKEN_RESPONSE", `Token endpoint responded ${res.status} without JSON`);
  }
  // GitHub and Slack answer 200 with an error body; everyone else uses 4xx.
  if (!res.ok || data.error || (p.okField && data.ok === false)) {
    const code = String(data.error ?? `HTTP_${res.status}`);
    throw new OAuthError(code === "invalid_grant" ? "INVALID_GRANT" : "TOKEN_EXCHANGE_FAILED", `Token endpoint error: ${code}`);
  }
  const accessToken = data.access_token as string | undefined;
  if (!accessToken) throw new OAuthError("BAD_TOKEN_RESPONSE", "Token response has no access_token");
  const expiresIn = Number(data.expires_in ?? data.expires ?? 0);
  return {
    accessToken,
    refreshToken: (data.refresh_token as string | undefined) ?? null,
    expiresAt: expiresIn > 0 ? new Date(Date.now() + expiresIn * 1000) : null,
    scope: (data.scope as string | undefined) ?? null,
    raw: data,
  };
}

export function exchangeCode(appId: string, p: OAuthProvider, code: string, codeVerifier: string | null) {
  const params: Record<string, string> = { grant_type: "authorization_code", code, redirect_uri: redirectUri(appId) };
  if (p.pkce && codeVerifier) params.code_verifier = codeVerifier;
  return tokenRequest(p, p.tokenUrl, params);
}

export function refreshAccessToken(p: OAuthProvider, refreshToken: string) {
  return tokenRequest(p, p.refreshUrl ?? p.tokenUrl, { grant_type: "refresh_token", refresh_token: refreshToken });
}
