import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { copy, fill } from "@/content";

const banned = ["HIPAA", "SOC 2", "SOC2", "military-grade", "military grade"];

describe("Public claims", () => {
  it("does not badge the security copy with standards we have not met", () => {
    const page = readFileSync(new URL("../../app/security/page.tsx", import.meta.url), "utf8");
    const catalog = fill(JSON.stringify(copy.security));
    const lower = `${page}\n${catalog}`.toLowerCase();
    for (const phrase of banned) {
      expect(
        lower.includes(phrase.toLowerCase()),
        `Remove "${phrase}" from the security page. The page lists controls that are true.`,
      ).toBe(false);
    }
    expect(catalog).toContain("Stripe");
    expect(catalog.toLowerCase()).toContain("ciphertext");
    expect(catalog.toLowerCase()).toContain("password");
    expect(catalog.toLowerCase()).not.toContain("in your account");
  });
});
