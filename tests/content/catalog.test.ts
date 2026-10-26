import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { fill, priceVars } from "@/content";
import { site } from "@/content/site";
import { fallbackPrices } from "@/lib/prices";

describe("Content catalog", () => {
  it("fills the site name and fallback prices into copy", () => {
    const vars = priceVars(fallbackPrices);
    expect(fill("{name} is {bandPrice} once", vars)).toBe("Glint is $69.99 once");
    expect(fill("backup {backupPrice} a year", vars)).toBe("backup $10 a year");
    expect(vars.amount).toBe("69.99");
  });

  it("keeps each product color hue in the design-system theme tokens", () => {
    const tokens = readFileSync(
      new URL("../../design-system/tokens/tokens.css", import.meta.url),
      "utf8",
    );
    for (const color of site.colors) {
      expect(tokens, `${color.id} hue ${color.hue}`).toContain(`oklch(0.82 0.09 ${color.hue})`);
    }
  });
});
