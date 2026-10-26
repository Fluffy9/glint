import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { emptyBackupState } from "../../functions/src/domain/state";
import { postStripeWebhook } from "../../functions/src/domain/webhook";

const secret = "whsec_test_secret";
const stripe = new Stripe("sk_test_123");
const env = { stripeSecretKey: "sk_test_123", webhookSecret: secret };

function signedRequest(payload: string, signature: string | null) {
  const headers = new Headers();
  if (signature) headers.set("stripe-signature", signature);
  return new Request("http://localhost/stripe/webhook", {
    method: "POST",
    headers,
    body: payload,
  });
}

describe("Stripe webhook", () => {
  it("rejects a missing or invalid signature and does not write", async () => {
    const payload = JSON.stringify({
      email: "secret-buyer@example.com",
      type: "checkout.session.completed",
    });
    const state = emptyBackupState();

    const missing = await postStripeWebhook(signedRequest(payload, null), state, env);
    const invalid = await postStripeWebhook(signedRequest(payload, "t=1,v1=deadbeef"), state, env);

    expect(missing.response.status).toBe(400);
    expect(invalid.response.status).toBe(400);
    expect(await missing.response.text()).not.toContain("secret-buyer@example.com");
    expect(await invalid.response.text()).not.toContain("secret-buyer@example.com");
    expect(missing.state.orders).toEqual([]);
    expect(invalid.state.orders).toEqual([]);
  });

  it("records a paid backup session and ignores subscription events", async () => {
    const paidAt = new Date("2026-01-01T00:00:00.000Z");
    const event = {
      id: "evt_test",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          object: "checkout.session",
          customer: "cus_1",
          customer_details: { email: "buyer@example.com" },
          customer_email: null,
          amount_total: 7999,
          payment_status: "paid",
          metadata: { band: "true", backup: "true" },
          subscription: null,
        },
      },
    };
    const payload = JSON.stringify(event);
    const signature = stripe.webhooks.generateTestHeaderString({ payload, secret });
    const result = await postStripeWebhook(signedRequest(payload, signature), emptyBackupState(), env, paidAt);

    expect(result.response.status).toBe(200);
    expect(result.state.orders[0]).toMatchObject({
      sessionId: "cs_test_1",
      email: "buyer@example.com",
      backup: true,
      band: true,
    });
    expect(result.state.entitlements[0]?.email).toBe("buyer@example.com");

    const subscription = {
      id: "evt_sub",
      object: "event",
      type: "customer.subscription.deleted",
      data: { object: { id: "sub_1", object: "subscription", customer: "cus_1", status: "canceled" } },
    };
    const subPayload = JSON.stringify(subscription);
    const subSignature = stripe.webhooks.generateTestHeaderString({ payload: subPayload, secret });
    const ignored = await postStripeWebhook(
      signedRequest(subPayload, subSignature),
      result.state,
      env,
      paidAt,
    );
    expect(ignored.response.status).toBe(200);
    expect(ignored.state).toEqual(result.state);
  });
});
