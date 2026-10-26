import { expect, type Locator, type Page } from "@playwright/test";

export async function appReady(page: Page) {
  await page.waitForFunction(() => {
    const link = document.querySelector("a.site-signin");
    if (!link) return false;
    return Object.keys(link).some((key) => key.startsWith("__react"));
  });
}

export async function boxOf(locator: Locator) {
  let box: { x: number; y: number; width: number; height: number } | null = null;
  await expect
    .poll(async () => {
      box = await locator.boundingBox();
      return Boolean(box && box.width > 0 && box.height > 0);
    })
    .toBe(true);
  return box!;
}

export async function computedColor(locator: Locator, property: "color" | "backgroundColor") {
  let color = "";
  await expect
    .poll(async () => {
      color = await locator.evaluate(
        (el, prop) => getComputedStyle(el)[prop],
        property,
      );
      return color;
    })
    .toMatch(/\S/);
  return color;
}
