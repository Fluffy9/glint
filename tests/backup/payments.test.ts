import { describe, expect, it } from "vitest";
import { paymentLinksFromEnv } from "../../lib/prices";

describe("Payment links", () => {
  it("enables checkout only when both public links are set", () => {
    expect(paymentLinksFromEnv({})).toEqual({
      bandPaymentUrl: null,
      backupPaymentUrl: null,
      checkoutEnabled: false,
    });
    expect(
      paymentLinksFromEnv({
        NEXT_PUBLIC_STRIPE_LINK_BAND: " https://buy.stripe.com/band ",
        NEXT_PUBLIC_STRIPE_LINK_BACKUP: "https://buy.stripe.com/backup",
      }),
    ).toEqual({
      bandPaymentUrl: "https://buy.stripe.com/band",
      backupPaymentUrl: "https://buy.stripe.com/backup",
      checkoutEnabled: true,
    });
  });
});
