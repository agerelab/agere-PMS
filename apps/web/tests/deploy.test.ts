import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as health } from "@/app/api/health/route";
import { GET as list } from "@/app/api/v1/integrations/route";
import { GET as cron } from "@/app/api/cron/integrations-refresh/route";
import { appUrl } from "@/lib/app-url";
import { getRequestContext, resetSessionResolver, setSessionResolver } from "@/lib/context";
import { stagingAuthorized } from "@/lib/staging";
import { proxy } from "@/proxy";
import { freshDb, jsonRes, mockFetch, ORG, setTestEnv } from "./helpers";

const basic = (pw: string, user = "team") => `Basic ${btoa(`${user}:${pw}`)}`;
const req = (path: string, auth?: string) => new NextRequest(`https://app.agere.test${path}`, { headers: auth ? { authorization: auth } : {} });

beforeEach(async () => {
  setTestEnv();
  await freshDb();
});
afterEach(() => {
  delete process.env.STAGING_PASSWORD;
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("staging gate", () => {
  it("is off without STAGING_PASSWORD", () => {
    expect(proxy(req("/app-center")).status).toBe(200);
  });

  it("asks for the password on pages and APIs", () => {
    process.env.STAGING_PASSWORD = "s3cret-staging";
    const res = proxy(req("/app-center"));
    expect(res.status).toBe(401);
    expect(res.headers.get("www-authenticate")).toMatch(/^Basic/);
    expect(proxy(req("/api/v1/integrations", basic("wrong"))).status).toBe(401);
    expect(proxy(req("/api/v1/integrations", basic("s3cret-staging"))).status).toBe(200);
    expect(stagingAuthorized(basic("s3cret-staging", "anyone"))).toBe(true);
    expect(stagingAuthorized("Basic !!!not-base64")).toBe(false);
  });

  it("leaves webhooks, cron and health open (they authenticate on their own)", () => {
    process.env.STAGING_PASSWORD = "s3cret-staging";
    for (const p of [`/api/v1/webhooks/github/${ORG}`, "/api/cron/integrations-refresh", "/api/health"]) expect(proxy(req(p)).status).toBe(200);
  });

  it("ignores DEV_AUTH in production: no password, no session", async () => {
    vi.stubEnv("NODE_ENV", "production");
    Object.assign(process.env, { DEV_AUTH: "1", DEV_ORGANIZATION_ID: ORG, DEV_USER_ID: "00000000-0000-7000-8000-0000000000c1", DEV_ROLE: "admin" });
    resetSessionResolver();
    await expect(getRequestContext(new Request("https://x/"))).rejects.toMatchObject({ status: 401 });
    delete process.env.DEV_AUTH;
  });
});

describe("app url", () => {
  it("falls back to the Vercel production domain", () => {
    vi.stubEnv("APP_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "agere-app.vercel.app");
    expect(appUrl()).toBe("https://agere-app.vercel.app");
  });
});

describe("health", () => {
  it("reports ok with database, encryption and configured apps — no secret values", async () => {
    const res = await health();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ ok: true, checks: { database: true, encryption: true, appUrl: true, cronSecret: true } });
    expect(body.configuredApps).toEqual(expect.arrayContaining(["github", "google-drive", "clockify"]));
    expect(JSON.stringify(body)).not.toContain("gh-secret");
  });

  it("returns 503 when encryption is misconfigured", async () => {
    vi.stubEnv("INTEGRATION_ENCRYPTION_KEYS", "");
    expect((await health()).status).toBe(503);
  });
});

describe("cron window", () => {
  it("uses CRON_REFRESH_WINDOW_MINUTES (daily Hobby schedule)", async () => {
    const { db } = await freshDb();
    const { workspaceIntegrations } = await import("@/db/schema");
    const { encryptSecret } = await import("@/lib/crypto/token-cipher");
    await db.insert(workspaceIntegrations).values({
      organizationId: ORG,
      appId: "google-drive",
      status: "connected",
      encryptedAccessToken: encryptSecret("a", `${ORG}:google-drive:access`),
      encryptedRefreshToken: encryptSecret("r", `${ORG}:google-drive:refresh`),
      tokenExpiresAt: new Date(Date.now() + 5 * 3600_000),
    });
    mockFetch([{ match: () => true, respond: () => jsonRes({ access_token: "n", expires_in: 3600 }) }]);
    const call = () => cron(new Request("https://x/api/cron/integrations-refresh", { headers: { authorization: "Bearer cron-secret" } }));
    expect(await (await call()).json()).toMatchObject({ checked: 0 }); // default 10 min window
    vi.stubEnv("CRON_REFRESH_WINDOW_MINUTES", "1500");
    expect(await (await call()).json()).toMatchObject({ checked: 1, refreshed: 1 });
  });
});

describe("staging session over HTTP", () => {
  it("lists integrations for a request with the staging password in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.STAGING_PASSWORD = "s3cret-staging";
    Object.assign(process.env, { DEV_ORGANIZATION_ID: ORG, DEV_USER_ID: "00000000-0000-7000-8000-0000000000c1", DEV_ROLE: "owner" });
    resetSessionResolver();
    expect((await list(new Request("https://x/api/v1/integrations"))).status).toBe(401);
    const ok = await list(new Request("https://x/api/v1/integrations", { headers: { authorization: basic("s3cret-staging") } }));
    expect(ok.status).toBe(200);
    setSessionResolver(async () => null);
  });
});
