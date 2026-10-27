import { expect, test, type Page } from "@playwright/test";
import { appReady, boxOf, computedColor } from "./ready";

function band(page: Page, name: string) {
  return page.locator("button.band-choice:visible", { hasText: name });
}

async function open(page: Page) {
  await page.goto("/");
  await appReady(page);
}

test("commits the new band after the colour wipe", async ({ page }) => {
  await open(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "lavender-light");

  await band(page, "Sky").click();
  expect(await band(page, "Lavender").getAttribute("aria-pressed")).toBe("true");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "sky-light", { timeout: 4_000 });
  await expect(band(page, "Sky")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".home-hero-wash.is-incoming:visible")).toHaveCount(0);
});

test("keeps the last colour when picks overlap", async ({ page }) => {
  await open(page);
  await band(page, "Mint").click();
  await band(page, "Peach").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "peach-light", { timeout: 3_000 });
  await expect(band(page, "Peach")).toHaveAttribute("aria-pressed", "true");
});

test("darkens the hero copy and leaves the box colour alone", async ({ page }) => {
  await open(page);
  const title = page.locator("h1.home-hero-title:visible");
  const sleeve = page.locator(".home-hero-stage:visible .gb-sleeve-front");
  const titleBefore = await computedColor(title, "color");
  const sleeveBefore = await computedColor(sleeve, "backgroundColor");

  await page.locator("button.nav-mode:visible").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "lavender-dark");

  const titleAfter = await computedColor(title, "color");
  const sleeveAfter = await computedColor(sleeve, "backgroundColor");
  expect(titleAfter).not.toBe(titleBefore);
  expect(sleeveAfter).toBe(sleeveBefore);

  const wash = await page
    .locator(".home-hero-wash:visible")
    .first()
    .evaluate((el) => getComputedStyle(el).getPropertyValue("--wash-hi"));
  expect(wash).toContain("0.36");
});

test("keeps dark mode after a reload", async ({ page }) => {
  await open(page);
  await page.locator("button.nav-mode:visible").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "lavender-dark");

  const cookie = await page.evaluate(() => document.cookie);
  expect(cookie).toContain("glint-appearance");

  const response = await page.reload();
  const html = (await response?.text()) ?? "";
  expect(html).toMatch(/data-theme="lavender-dark"/);
  expect(html).toContain("glint-appearance");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "lavender-dark");
  await appReady(page);
  await expect(page.locator("button.nav-mode:visible")).toHaveAttribute("aria-pressed", "true");
});

test("turns the packaging box when it is dragged", async ({ page }) => {
  await open(page);
  const stage = page.locator(".home-hero-stage:visible");
  const rot = page.locator(".home-hero-stage:visible .gb-rot");
  const before = await rot.evaluate((el) => getComputedStyle(el).transform);
  const box = await boxOf(stage);

  const x = box.x + box.width - 140;
  const y = box.y + box.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 90, y);
  await page.mouse.up();

  const after = await rot.evaluate((el) => getComputedStyle(el).transform);
  expect(after).not.toBe(before);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("commits the band without a wipe", async ({ page }) => {
    await open(page);
    await band(page, "Mint").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mint-light");
    await expect(page.locator(".home-hero-wash.is-incoming:visible")).toHaveCount(0);
  });
});
