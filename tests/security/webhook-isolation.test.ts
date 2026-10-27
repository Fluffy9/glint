import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Stripe webhook isolation", () => {
  it("does not import health storage", () => {
    const webhook = readFileSync(new URL("../../functions/src/index.ts", import.meta.url), "utf8");
    expect(webhook).not.toContain("lib/health");
    expect(webhook.toLowerCase()).not.toContain("health.");
  });
});
