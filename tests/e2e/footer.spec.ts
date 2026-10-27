import { expect, test } from "@playwright/test";
import { appReady, boxOf } from "./ready";

const groups = [
  {
    title: "Shop",
    links: [
      ["Home", "/"],
      ["Pricing", "/pricing"],
      ["Dashboard", "/dashboard"],
    ],
  },
  {
    title: "Trust",
    links: [
      ["Privacy", "/privacy"],
      ["Security", "/security"],
    ],
  },
  {
    title: "Compare",
    links: [
      ["vs Whoop", "/vs/whoop"],
      ["vs Fitbit Air", "/vs/fitbit-air"],
      ["vs Helio Strap", "/vs/helio-strap"],
      ["vs Polar Loop", "/vs/polar-loop"],
    ],
  },
] as const;

function footer(page: import("@playwright/test").Page) {
  return page.locator("footer.site-footer:visible");
}

test("lists every site page in footer sections", async ({ page }) => {
  await page.goto("/");
  await appReady(page);

  const bar = footer(page);
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("link", { name: "@Pupcakes" })).toHaveAttribute(
    "href",
    "https://pupcakes.me",
  );
  await expect(bar.locator(".site-footer-group:visible")).toHaveCount(groups.length);

  for (const group of groups) {
    const column = bar.locator(".site-footer-group:visible", {
      has: page.locator(".site-footer-label", { hasText: group.title }),
    });
    await expect(column).toBeVisible();
    await expect(column.getByRole("link")).toHaveCount(group.links.length);

    for (const [label, href] of group.links) {
      await expect(column.getByRole("link", { name: label, exact: true })).toHaveAttribute(
        "href",
        href,
      );
    }
  }
});

test("keeps the same footer groups on an inner page", async ({ page }) => {
  await page.goto("/privacy");
  await appReady(page);

  const bar = footer(page);
  await expect(bar.locator(".site-footer-label:visible")).toHaveText([
    "Shop",
    "Trust",
    "Compare",
  ]);
  await expect(bar.getByRole("link", { name: "vs Whoop", exact: true })).toHaveAttribute(
    "href",
    "/vs/whoop",
  );
  await expect(bar.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
    "href",
    "/",
  );
});

test("keeps the maker credit under the footer links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  await appReady(page);

  const bar = footer(page);
  const credit = await boxOf(bar.locator("> p"));
  const nav = await boxOf(bar.locator("nav.site-footer-nav"));
  expect(credit.y).toBeGreaterThan(nav.y + nav.height - 1);
});
