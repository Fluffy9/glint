import { describe, expect, it } from "vitest";
import { parseCheckoutSelection } from "../../lib/checkout-selection";

describe("Checkout allowlist", () => {
  it("accepts the band, or the band plus backup", () => {
    expect(parseCheckoutSelection({ backup: false })).toEqual({ backup: false });
    expect(parseCheckoutSelection({ backup: true })).toEqual({ backup: true });
  });

  it("rejects any other shape", () => {
    expect(parseCheckoutSelection(null)).toBeNull();
    expect(parseCheckoutSelection([])).toBeNull();
    expect(parseCheckoutSelection({ backup: "true" })).toBeNull();
    expect(parseCheckoutSelection({ band: true })).toBeNull();
    expect(parseCheckoutSelection({ backup: true, price: "price_evil" })).toBeNull();
    expect(parseCheckoutSelection({ backup: true, email: "a@example.com" })).toBeNull();
  });
});
