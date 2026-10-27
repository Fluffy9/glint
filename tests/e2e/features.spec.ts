import { expect, test } from "@playwright/test";
import { appReady } from "./ready";

const features = [
  ["No BS", "Plain language about what the band stores"],
  ["No screen", "Nothing on your wrist to check mid-run"],
  ["Local first", "lives in this browser"],
  ["No account", "The dashboard is free"],
  ["Encrypted backup", "ciphertext only"],
  ["Never sold", "not a product, a feed, or an ad target"],
  ["Export anytime", "Google Drive"],
  ["Delete anytime", "Wipe this browser"],
] as const;

test("shows every feature card under fitness tracking", async ({ page }) => {
  await page.goto("/");
  await appReady(page);

  const section = page.locator("section:visible", {
    has: page.getByRole("heading", { name: "Fitness tracking that just works" }),
  });
  await expect(section).toBeVisible();
  await expect(section.locator(".feature-card:visible")).toHaveCount(features.length);
  await expect(section.getByRole("link")).toHaveCount(0);

  for (const [title, snippet] of features) {
    const card = section.locator(".feature-card:visible", {
      has: page.locator(".feature-card-title", { hasText: new RegExp(`^${title}$`) }),
    });
    await expect(card.locator("svg.feature-icon")).toBeVisible();
    await expect(card).toContainText(snippet);
  }
});
