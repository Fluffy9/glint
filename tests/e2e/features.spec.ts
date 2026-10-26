import { expect, test } from "@playwright/test";
import { appReady } from "./ready";

const features = [
  ["No BS", "Plain language about what the band stores"],
  ["No screen", "Nothing on your wrist to check mid-run"],
  ["Works offline", "Tracking stays on the phone"],
  ["Long battery", "Days of wear between charges"],
  ["Encrypted data", "Optional backup is scrambled"],
  ["Never sold", "not a product, a feed, or an ad target"],
  ["Export anytime", "Google Drive"],
  ["Delete anytime", "Delete the account and so are we"],
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
    const card = section.locator(".feature-card:visible", { hasText: title });
    await expect(card.locator("svg.feature-icon")).toBeVisible();
    await expect(card).toContainText(snippet);
  }
});
