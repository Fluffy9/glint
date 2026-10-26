import { expect, test, type Page } from "@playwright/test";
import { appReady, boxOf } from "./ready";

const competitors = [
  {
    name: "Whoop",
    slug: "whoop",
    band: "No one-time price",
    keep: "Yearly membership required",
    source: "Whoop membership",
    href: "https://www.whoop.com/us/en/membership/",
  },
  {
    name: "Fitbit Air",
    slug: "fitbit-air",
    band: "$99.99 once",
    keep: "$9.99/month or $99.99/year",
    source: "Google Store · Fitbit Air",
    href: "https://store.google.com/product/google_fitbit_air?hl=en-US",
  },
  {
    name: "Helio Strap",
    slug: "helio-strap",
    band: "$99.99 once",
    keep: "No subscription. One payment.",
    source: "Amazfit · Helio Strap",
    href: "https://us.amazfit.com/products/helio-strap",
  },
  {
    name: "Polar Loop",
    slug: "polar-loop",
    band: "$199.99 once",
    keep: "No subscription. One payment.",
    source: "Polar · Loop",
    href: "https://www.polar.com/us-en/loop",
  },
] as const;

function section(page: Page) {
  return page.locator("section:visible", {
    has: page.getByRole("heading", { name: "Glint vs the usual stack" }),
  });
}

function shown(page: Page) {
  return section(page).locator("[role=tabpanel]:visible");
}

async function warpBox(page: Page) {
  return section(page).locator(".gl-warp").evaluate((el) => {
    const box = el.getBoundingClientRect();
    return {
      width: box.width,
      height: box.height,
      attrWidth: Number(el.getAttribute("width")),
      attrHeight: Number(el.getAttribute("height")),
    };
  });
}

test("keeps one comparison size and names once versus yearly", async ({ page }) => {
  await page.goto("/");
  await appReady(page);

  const band = section(page);
  await expect(band).toBeVisible();
  await expect(band).toContainText("Whoop bills by the year");
  await expect(band).toContainText("sell the band once");
  await expect(band.locator("[role=tabpanel]")).toHaveCount(competitors.length);

  const height = (await boxOf(band.locator(".compare-band"))).height;

  for (const competitor of competitors) {
    await band.getByRole("tab", { name: competitor.name }).click();
    await expect(band.getByRole("tab", { name: competitor.name })).toHaveAttribute("aria-selected", "true");

    const panel = shown(page);
    await expect(panel.getByRole("heading", { name: `Glint vs ${competitor.name}` })).toBeVisible();
    await expect(panel).toContainText("$69.99 once");
    await expect(panel).toContainText(competitor.band);
    await expect(panel).toContainText(competitor.keep);
    const source = panel.getByRole("link", { name: competitor.source });
    await expect(source).toHaveAttribute("href", competitor.href);
    await expect(source).toHaveAttribute("target", "_blank");

    const next = (await boxOf(band.locator(".compare-band"))).height;
    expect(next).toBe(height);
  }
});

test("scrolls the comparison table when the window is narrow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  await appReady(page);

  const panel = shown(page);
  const body = panel.locator(".compare-body");
  await expect(panel.locator(".compare-card-title")).toBeVisible();
  await expect
    .poll(async () =>
      body.evaluate((el) => ({
        scroll: el.scrollWidth > el.clientWidth + 1,
        titleOutside: !el.querySelector(".compare-card-title"),
      })),
    )
    .toEqual({ scroll: true, titleOutside: true });
});

test("keeps the comparison pattern the same size when the window changes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await appReady(page);

  const wide = await warpBox(page);
  expect(wide.width).toBe(wide.attrWidth);
  expect(wide.height).toBe(wide.attrHeight);

  await page.setViewportSize({ width: 720, height: 800 });
  const narrow = await warpBox(page);
  expect(narrow).toEqual(wide);
});

test("publishes a crawlable page for each competitor", async ({ page }) => {
  for (const competitor of competitors) {
    await page.goto(`/vs/${competitor.slug}`);
    await appReady(page);

    await expect(page).toHaveTitle(`Glint vs ${competitor.name} · Glint`);
    await expect(page.getByRole("heading", { level: 1, name: `Glint vs ${competitor.name}` })).toBeVisible();
    await expect(page.locator("article")).toContainText(competitor.band);
    await expect(page.locator("article")).toContainText("$69.99 once");
    const source = page.getByRole("link", { name: competitor.source });
    await expect(source).toBeVisible();
    await expect(source).toHaveAttribute("href", competitor.href);
  }
});
