import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const banned = ["HIPAA", "SOC 2", "SOC2", "military-grade", "military grade"];

describe("Public claims", () => {
  it("does not badge the security page with standards we have not met", () => {
    const page = readFileSync(
      new URL("../../app/security/page.tsx", import.meta.url),
      "utf8",
    );
    const lower = page.toLowerCase();
    for (const phrase of banned) {
      expect(
        lower.includes(phrase.toLowerCase()),
        `Remove "${phrase}" from the security page. The page lists controls that are true.`,
      ).toBe(false);
    }
    expect(page).toContain("Stripe");
    expect(page).toContain("Locked backup");
    expect(page.toLowerCase()).toContain("in your account");
  });
});
