import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { paidSessionFromCheckout } from "../../functions/src/domain/webhook";

const paidAt = new Date("2026-01-01T00:00:00.000Z");

function session(metadata: Stripe.Metadata): Stripe.Checkout.Session {
  return {
    id: "cs_1",
    object: "checkout.session",
    customer: "cus_1",
    customer_details: { email: "a@b.co" },
    amount_total: 6999,
    payment_status: "paid",
    metadata,
  } as Stripe.Checkout.Session;
}

describe("Payment link metadata", () => {
  it("turns backup on only when metadata says so", () => {
    expect(paidSessionFromCheckout(session({ band: "true", backup: "true" }), paidAt).backup).toBe(true);
    expect(paidSessionFromCheckout(session({ band: "true", backup: "false" }), paidAt).backup).toBe(false);
    expect(paidSessionFromCheckout(session({ backup: "true", price: "price_evil" }), paidAt)).toMatchObject({
      backup: true,
      email: "a@b.co",
      customerId: "cus_1",
    });
  });
});
