import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setSessionResolver } from "@/lib/context";
import { GET as list } from "@/app/api/v1/integrations/route";
import { GET as connect, POST as connectApiKey } from "@/app/api/v1/integrations/[appId]/connect/route";
import { GET as callback } from "@/app/api/v1/integrations/[appId]/callback/route";
import { POST as disconnectRoute } from "@/app/api/v1/integrations/[appId]/disconnect/route";
import { GET as cron } from "@/app/api/cron/integrations-refresh/route";
import { ADMIN, freshDb, jsonRes, MEMBER, mockFetch, ORG, setTestEnv } from "./helpers";

const P = (appId: string) => ({ params: Promise.resolve({ appId }) });
let role: "admin" | "member" = "admin";

beforeEach(async () => {
  setTestEnv();
  await freshDb();
  role = "admin";
  setSessionResolver(async () => ({ organizationId: ORG, userId: role === "admin" ? ADMIN : MEMBER, role }));
});
afterEach(() => vi.unstubAllGlobals());

describe("REST API", () => {
  it("GET /api/v1/integrations returns the catalog", async () => {
    const res = await list(new Request("https://app.agere.test/api/v1/integrations"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(17);
    expect(body.viewer.canManage).toBe(true);
  });

  it("401 without a session", async () => {
    setSessionResolver(async () => null);
    expect((await list(new Request("https://app.agere.test/api/v1/integrations"))).status).toBe(401);
  });

  it("connect → callback → connected, end to end over HTTP", async () => {
    const res = await connect(new Request("https://app.agere.test/api/v1/integrations/github/connect"), P("github"));
    const { url } = await res.json();
    mockFetch([
      { match: (u) => u.includes("access_token"), respond: () => jsonRes({ access_token: "gho" }) },
      { match: (u) => u === "https://api.github.com/user", respond: () => jsonRes({ id: 1, login: "octo" }) },
    ]);
    const state = new URL(url).searchParams.get("state");
    const cb = await callback(new Request(`https://app.agere.test/api/v1/integrations/github/callback?code=c&state=${state}`), P("github"));
    expect(cb.status).toBe(303);
    expect(cb.headers.get("location")).toBe("https://app.agere.test/app-center?integration=github&result=connected");
    const items = (await (await list(new Request("https://app.agere.test/api/v1/integrations"))).json()).data;
    expect(items.find((i: any) => i.id === "github")).toMatchObject({ status: "connected", account: "octo" });
  });

  it("?redirect=1 answers with a 302 to the provider", async () => {
    const res = await connect(new Request("https://app.agere.test/api/v1/integrations/github/connect?redirect=1"), P("github"));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toMatch(/^https:\/\/github\.com\/login\/oauth\/authorize\?/);
  });

  it("a bad callback lands back on the App Center with an error code", async () => {
    const cb = await callback(new Request("https://app.agere.test/api/v1/integrations/github/callback?code=c&state=forged"), P("github"));
    expect(cb.headers.get("location")).toBe("https://app.agere.test/app-center?integration=github&result=error&code=INVALID_STATE");
  });

  it("members get 403 on connect and disconnect", async () => {
    role = "member";
    expect((await connect(new Request("https://app.agere.test/x"), P("github"))).status).toBe(403);
    expect((await disconnectRoute(new Request("https://app.agere.test/x", { method: "POST" }), P("github"))).status).toBe(403);
  });

  it("blocks cross-site POSTs (CSRF)", async () => {
    const res = await connectApiKey(new Request("https://app.agere.test/x", { method: "POST", headers: { origin: "https://evil.example" }, body: "{}" }), P("clockify"));
    expect(res.status).toBe(403);
  });

  it("unknown app → 404", async () => {
    expect((await connect(new Request("https://app.agere.test/x"), P("myspace"))).status).toBe(404);
  });

  it("cron endpoint requires the shared secret", async () => {
    expect((await cron(new Request("https://app.agere.test/api/cron/integrations-refresh"))).status).toBe(401);
    const ok = await cron(new Request("https://app.agere.test/api/cron/integrations-refresh", { headers: { authorization: "Bearer cron-secret" } }));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ checked: 0, refreshed: 0, failed: 0 });
  });
});
