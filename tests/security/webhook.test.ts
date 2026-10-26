import Stripe from "stripe";
import { beforeEach, describe, expect, it, vi } from "vitest";

const upsertOrder = vi.fn();
const upsertSubscription = vi.fn();

vi.mock("../../lib/commerce-db", () => ({
  upsertOrder: (...args: unknown[]) => upsertOrder(...args),
  upsertSubscription: (...args: unknown[]) => upsertSubscription(...args),
}));

import { POST } from "../../app/api/stripe/webhook/route";

const secret = "whsec_test_secret";
const stripe = new Stripe("sk_test_123");

function signedRequest(payload: string, signature: string | null) {
  const headers = new Headers();
  if (signature) headers.set("stripe-signature", signature);
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers,
    body: payload,
  });
}

describe("Webhook signature", () => {
  beforeEach(() => {
    upsertOrder.mockReset();
    upsertSubscription.mockReset();
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    process.env.STRIPE_WEBHOOK_SECRET = secret;
  });

  it("rejects a missing or invalid signature and does not write", async () => {
    const payload = JSON.stringify({
      email: "secret-buyer@example.com",
      type: "checkout.session.completed",
    });

    const missing = await POST(signedRequest(payload, null));
    const invalid = await POST(signedRequest(payload, "t=1,v1=deadbeef"));

    expect(missing.status).toBe(400);
    expect(invalid.status).toBe(400);
    expect(await missing.text()).not.toContain("secret-buyer@example.com");
    expect(await invalid.text()).not.toContain("secret-buyer@example.com");
    expect(upsertOrder).not.toHaveBeenCalled();
    expect(upsertSubscription).not.toHaveBeenCalled();
  });

  it("accepts a signature from the Stripe helper and records the order", async () => {
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
          amount_total: 6999,
          payment_status: "paid",
          metadata: { band: "true", backup: "false" },
          subscription: null,
        },
      },
    };
    const payload = JSON.stringify(event);
    const signature = stripe.webhooks.generateTestHeaderString({ payload, secret });

    const response = await POST(signedRequest(payload, signature));

    expect(response.status).toBe(200);
    expect(upsertOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: "cs_test_1",
        email: "buyer@example.com",
        backup: false,
        band: true,
      }),
    );
  });
});
