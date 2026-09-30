// Per-provider webhook authentication. Each verifier returns the delivery id and event type, or
// null when the request is not authentic. Apps without a verifier cannot receive webhooks yet.
import { createHmac, timingSafeEqual } from "node:crypto";

export type VerifiedDelivery = { deliveryId: string; eventType: string };
type Verifier = (headers: Headers, rawBody: string, secret: string) => VerifiedDelivery | null;

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const VERIFIERS: Record<string, Verifier> = {
  // https://docs.github.com/webhooks/using-webhooks/validating-webhook-deliveries
  github: (h, body, secret) => {
    const sig = h.get("x-hub-signature-256") ?? "";
    const expected = `sha256=${createHmac("sha256", secret).update(body, "utf8").digest("hex")}`;
    if (!safeEqual(sig, expected)) return null;
    const deliveryId = h.get("x-github-delivery");
    const eventType = h.get("x-github-event");
    return deliveryId && eventType ? { deliveryId, eventType } : null;
  },
  // GitLab sends the configured secret verbatim in X-Gitlab-Token
  gitlab: (h, _body, secret) => {
    if (!safeEqual(h.get("x-gitlab-token") ?? "", secret)) return null;
    const deliveryId = h.get("x-gitlab-event-uuid") ?? h.get("x-gitlab-webhook-uuid");
    const eventType = h.get("x-gitlab-event");
    return deliveryId && eventType ? { deliveryId, eventType } : null;
  },
};

export const webhookSupported = (appId: string) => Object.prototype.hasOwnProperty.call(VERIFIERS, appId);
