// AES-256-GCM for integration secrets (access/refresh tokens, webhook secrets, PKCE verifiers).
//
// Format: v1.<keyId>.<iv>.<ciphertext>.<tag>  (base64url parts, 12-byte IV, 16-byte tag)
// Every value is bound to a context string (additional authenticated data), e.g.
// "<organizationId>:github:access", so a ciphertext copied to another row or tenant fails to decrypt.
// Keys come from INTEGRATION_ENCRYPTION_KEYS ("k1:<base64>,k2:<base64>"); new values use
// INTEGRATION_ENCRYPTION_KEY_ID, old ids stay readable for rotation.
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const VERSION = "v1";
const IV_BYTES = 12;

type Keyring = { current: string; keys: Map<string, Buffer> };
let cached: { raw: string; ring: Keyring } | undefined;

export class TokenCipherError extends Error {}

function keyring(): Keyring {
  const raw = `${process.env.INTEGRATION_ENCRYPTION_KEY_ID ?? ""}|${process.env.INTEGRATION_ENCRYPTION_KEYS ?? ""}`;
  if (cached?.raw === raw) return cached.ring;
  const keys = new Map<string, Buffer>();
  for (const entry of (process.env.INTEGRATION_ENCRYPTION_KEYS ?? "").split(",").map((s) => s.trim()).filter(Boolean)) {
    const i = entry.indexOf(":");
    if (i < 1) throw new TokenCipherError("INTEGRATION_ENCRYPTION_KEYS entries must be <id>:<base64 key>");
    const id = entry.slice(0, i);
    const key = Buffer.from(entry.slice(i + 1), "base64");
    if (key.length !== 32) throw new TokenCipherError(`Encryption key ${id} must be 32 bytes`);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new TokenCipherError(`Invalid encryption key id ${id}`);
    keys.set(id, key);
  }
  const current = process.env.INTEGRATION_ENCRYPTION_KEY_ID ?? "";
  if (!keys.has(current)) throw new TokenCipherError("INTEGRATION_ENCRYPTION_KEY_ID does not name a key in INTEGRATION_ENCRYPTION_KEYS");
  const ring = { current, keys };
  cached = { raw, ring };
  return ring;
}

export function encryptSecret(plaintext: string, context: string): string {
  const { current, keys } = keyring();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", keys.get(current)!, iv);
  cipher.setAAD(Buffer.from(context, "utf8"));
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return [VERSION, current, iv.toString("base64url"), ct.toString("base64url"), cipher.getAuthTag().toString("base64url")].join(".");
}

export function decryptSecret(payload: string, context: string): string {
  const parts = payload.split(".");
  if (parts.length !== 5 || parts[0] !== VERSION) throw new TokenCipherError("Unrecognized ciphertext format");
  const [, keyId, iv, ct, tag] = parts;
  const key = keyring().keys.get(keyId);
  if (!key) throw new TokenCipherError(`Unknown encryption key id ${keyId}`);
  try {
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64url"));
    decipher.setAAD(Buffer.from(context, "utf8"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(ct, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    throw new TokenCipherError("Ciphertext failed authentication");
  }
}

/** True when the value was written with an older key and should be re-encrypted. */
export function needsReencrypt(payload: string): boolean {
  return payload.split(".")[1] !== keyring().current;
}

export const nullableEncrypt = (v: string | null | undefined, ctx: string) => (v ? encryptSecret(v, ctx) : null);
export const nullableDecrypt = (v: string | null | undefined, ctx: string) => (v ? decryptSecret(v, ctx) : null);
