import { beforeEach, describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret, needsReencrypt, TokenCipherError } from "@/lib/crypto/token-cipher";
import { setTestEnv } from "./helpers";

describe("token cipher (AES-256-GCM)", () => {
  beforeEach(setTestEnv);

  it("round-trips and never returns the plaintext in the ciphertext", () => {
    const c = encryptSecret("gho_secret_token", "org:github:access");
    expect(c).toMatch(/^v1\.k1\./);
    expect(c).not.toContain("gho_secret_token");
    expect(decryptSecret(c, "org:github:access")).toBe("gho_secret_token");
  });

  it("uses a fresh IV every time", () => {
    expect(encryptSecret("x", "ctx")).not.toBe(encryptSecret("x", "ctx"));
  });

  it("rejects a ciphertext moved to another row or tenant (AAD mismatch)", () => {
    const c = encryptSecret("token", "orgA:github:access");
    expect(() => decryptSecret(c, "orgB:github:access")).toThrow(TokenCipherError);
  });

  it("rejects tampered ciphertext", () => {
    const parts = encryptSecret("token", "ctx").split(".");
    parts[3] = Buffer.from("tampered").toString("base64url");
    expect(() => decryptSecret(parts.join("."), "ctx")).toThrow(TokenCipherError);
  });

  it("keeps old keys readable after rotation and flags values for re-encryption", () => {
    const old = encryptSecret("token", "ctx");
    process.env.INTEGRATION_ENCRYPTION_KEYS += `,k2:${Buffer.alloc(32, 9).toString("base64")}`;
    process.env.INTEGRATION_ENCRYPTION_KEY_ID = "k2";
    expect(decryptSecret(old, "ctx")).toBe("token");
    expect(needsReencrypt(old)).toBe(true);
    expect(needsReencrypt(encryptSecret("token", "ctx"))).toBe(false);
  });

  it("refuses a misconfigured key", () => {
    process.env.INTEGRATION_ENCRYPTION_KEYS = `k1:${Buffer.alloc(16).toString("base64")}`;
    expect(() => encryptSecret("x", "ctx")).toThrow(/32 bytes/);
  });
});
