import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Db } from "@/db/client";
import { userIntegrations, workspaceIntegrations } from "@/db/schema";
import { decryptSecret, encryptSecret } from "@/lib/crypto/token-cipher";
import { getWorkspaceAccessToken, refreshExpiringTokens } from "@/modules/integrations/service";
import { ADMIN, bodyOf, freshDb, jsonRes, MEMBER, mockFetch, ORG, setTestEnv } from "./helpers";

let db: Db;
beforeEach(async () => {
  setTestEnv();
  ({ db } = await freshDb());
});
afterEach(() => vi.unstubAllGlobals());

async function seedDrive(expiresInMs: number) {
  await db.insert(workspaceIntegrations).values({
    organizationId: ORG,
    appId: "google-drive",
    status: "connected",
    encryptedAccessToken: encryptSecret("old-access", `${ORG}:google-drive:access`),
    encryptedRefreshToken: encryptSecret("the-refresh", `${ORG}:google-drive:refresh`),
    tokenExpiresAt: new Date(Date.now() + expiresInMs),
    connectedBy: ADMIN,
  });
}

describe("token refresh job", () => {
  it("refreshes tokens about to expire and keeps the refresh token when the provider sends none", async () => {
    await seedDrive(2 * 60_000);
    const calls = mockFetch([{ match: (u) => u === "https://oauth2.googleapis.com/token", respond: () => jsonRes({ access_token: "new-access", expires_in: 3600 }) }]);
    expect(await refreshExpiringTokens(db)).toEqual({ checked: 1, refreshed: 1, failed: 0 });
    expect(bodyOf(calls[0].init).get("grant_type")).toBe("refresh_token");
    expect(bodyOf(calls[0].init).get("refresh_token")).toBe("the-refresh");
    const [row] = await db.select().from(workspaceIntegrations);
    expect(decryptSecret(row.encryptedAccessToken!, `${ORG}:google-drive:access`)).toBe("new-access");
    expect(decryptSecret(row.encryptedRefreshToken!, `${ORG}:google-drive:refresh`)).toBe("the-refresh");
    expect(row.tokenExpiresAt!.getTime()).toBeGreaterThan(Date.now() + 3500_000);
  });

  it("stores a rotated refresh token", async () => {
    await seedDrive(60_000);
    mockFetch([{ match: () => true, respond: () => jsonRes({ access_token: "a2", refresh_token: "r2", expires_in: 3600 }) }]);
    await refreshExpiringTokens(db);
    const [row] = await db.select().from(workspaceIntegrations);
    expect(decryptSecret(row.encryptedRefreshToken!, `${ORG}:google-drive:refresh`)).toBe("r2");
  });

  it("leaves tokens with plenty of time alone", async () => {
    await seedDrive(60 * 60_000);
    mockFetch([]);
    expect(await refreshExpiringTokens(db)).toMatchObject({ checked: 0 });
  });

  it("marks the connection for reconnect when the refresh token is revoked", async () => {
    await seedDrive(60_000);
    mockFetch([{ match: () => true, respond: () => jsonRes({ error: "invalid_grant" }, 400) }]);
    expect(await refreshExpiringTokens(db)).toMatchObject({ refreshed: 0, failed: 1 });
    const [row] = await db.select().from(workspaceIntegrations);
    expect(row).toMatchObject({ status: "error", lastError: "reauthorize", refreshFailures: 1 });
  });

  it("retries transient failures a few times before giving up", async () => {
    await seedDrive(60_000);
    mockFetch([{ match: () => true, respond: () => new Response("upstream down", { status: 503 }) }]);
    await refreshExpiringTokens(db);
    let [row] = await db.select().from(workspaceIntegrations);
    expect(row).toMatchObject({ status: "connected", refreshFailures: 1 });
    for (let i = 0; i < 4; i++) await refreshExpiringTokens(db);
    [row] = await db.select().from(workspaceIntegrations);
    expect(row).toMatchObject({ status: "error", refreshFailures: 5 });
  });

  it("refreshes personal (per-member) connections too", async () => {
    await db.insert(userIntegrations).values({
      organizationId: ORG,
      userId: MEMBER,
      appId: "google-drive",
      status: "connected",
      encryptedAccessToken: encryptSecret("m-old", `${ORG}:google-drive:user:${MEMBER}:access`),
      encryptedRefreshToken: encryptSecret("m-refresh", `${ORG}:google-drive:user:${MEMBER}:refresh`),
      tokenExpiresAt: new Date(Date.now() + 30_000),
    });
    mockFetch([{ match: () => true, respond: () => jsonRes({ access_token: "m-new", expires_in: 3600 }) }]);
    expect(await refreshExpiringTokens(db)).toMatchObject({ refreshed: 1 });
    const [row] = await db.select().from(userIntegrations);
    expect(decryptSecret(row.encryptedAccessToken, `${ORG}:google-drive:user:${MEMBER}:access`)).toBe("m-new");
  });

  it("refreshes on demand when a caller needs a token that is about to expire", async () => {
    await seedDrive(10_000);
    mockFetch([{ match: () => true, respond: () => jsonRes({ access_token: "fresh", expires_in: 3600 }) }]);
    expect(await getWorkspaceAccessToken(db, ORG, "google-drive")).toBe("fresh");
  });
});
