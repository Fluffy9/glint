import { describe, expect, it } from "vitest";
import { waitlistEmail } from "../../functions/src/domain/waitlist";

describe("waitlist email", () => {
  it("normalizes a valid address", () => {
    expect(waitlistEmail("  Ada@Example.COM ")).toBe("ada@example.com");
  });

  it("rejects empty and malformed values", () => {
    expect(waitlistEmail("")).toBeNull();
    expect(waitlistEmail("not-an-email")).toBeNull();
    expect(waitlistEmail("@missing.local")).toBeNull();
    expect(waitlistEmail("missing@")).toBeNull();
  });
});
