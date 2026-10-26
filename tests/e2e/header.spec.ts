import { expect, test, type Locator, type Page } from "@playwright/test";
import { appReady, boxOf } from "./ready";

async function offsetFromCenter(header: Locator, links: Locator) {
  const headerBox = await boxOf(header);
  const linksBox = await boxOf(links);
  const headerMid = headerBox.x + headerBox.width / 2;
  const linksMid = linksBox.x + linksBox.width / 2;
  return { delta: Math.abs(headerMid - linksMid), headerBox, linksBox };
}

async function open(page: Page, path: string) {
  await page.goto(path);
  await appReady(page);
}

test("centers Pricing, Privacy, and Security in the hero header", async ({ page }) => {
  await open(page, "/");
  const header = page.locator("header.home-hero-nav:visible");
  const links = page.locator("nav.site-links:visible");
  const { delta, linksBox } = await offsetFromCenter(header, links);
  expect(delta).toBeLessThan(12);

  const signBox = await boxOf(page.locator("a.site-signin:visible"));
  expect(signBox.x).toBeGreaterThan(linksBox.x + linksBox.width);
});

test("centers the same links in the page header", async ({ page }) => {
  await open(page, "/pricing");
  const header = page.locator("header.site-nav:visible");
  const links = page.locator("nav.site-links:visible");
  const { delta, linksBox } = await offsetFromCenter(header, links);
  expect(delta).toBeLessThan(12);

  const markBox = await boxOf(page.locator("header.site-nav:visible a.wordmark"));
  expect(markBox.x).toBeLessThan(linksBox.x);
});

test("hides Pricing, Privacy, and Security when the header is narrow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await open(page, "/");
  await expect(page.locator("header.home-hero-nav:visible nav.site-links")).toBeHidden();
  await expect(page.locator("a.site-signin:visible")).toBeVisible();
});

test("opens pricing, privacy, and security from the header", async ({ page }) => {
  await open(page, "/");
  const nav = () => page.locator("nav.site-links:visible");
  await nav().getByRole("link", { name: "Pricing" }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await nav().getByRole("link", { name: "Privacy" }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await nav().getByRole("link", { name: "Security" }).click();
  await expect(page).toHaveURL(/\/security$/);
});
