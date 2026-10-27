import { expect, test, type Page } from "@playwright/test";
import { appReady } from "./ready";

const widths = [390, 760, 1100, 1280, 1440, 1920];

const pages = ["/", "/pricing", "/privacy", "/security", "/dashboard", "/vs/whoop"];

type Offender = { tag: string; cls: string; left: number; right: number };

type Report = {
  clientWidth: number;
  scrollWidth: number;
  canScroll: boolean;
  offenders: Offender[];
  headline: { left: number; right: number } | null;
  facesOutside: { left: number; right: number }[];
};

async function overflowReport(page: Page): Promise<Report> {
  return page.evaluate(() => {
    const root = document.documentElement;
    const clientWidth = root.clientWidth;
    const previous = root.scrollLeft;
    root.scrollLeft = clientWidth;
    const canScroll = root.scrollLeft > 0;
    root.scrollLeft = previous;

    const clipped = (el: Element) => {
      let parent = el.parentElement;
      while (parent) {
        const overflow = getComputedStyle(parent).overflowX;
        if (overflow === "clip" || overflow === "hidden" || overflow === "auto" || overflow === "scroll") {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    };

    const offenders: Offender[] = [];
    for (const el of document.body.querySelectorAll("*")) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      const left = Math.round(rect.left);
      const right = Math.round(rect.right);
      if (left >= -1 && right <= clientWidth + 1) continue;
      if (clipped(el)) continue;
      offenders.push({
        tag: el.tagName,
        cls: (el.getAttribute("class") ?? "").slice(0, 80),
        left,
        right,
      });
      if (offenders.length >= 8) break;
    }

    const headline = document.querySelector("h1")?.getBoundingClientRect();
    const facesOutside = [...document.querySelectorAll(".gb-face")]
      .map((el) => el.getBoundingClientRect())
      .filter((rect) => rect.width > 2 && (rect.left < -1 || rect.right > clientWidth + 1))
      .map((rect) => ({ left: Math.round(rect.left), right: Math.round(rect.right) }));

    return {
      clientWidth,
      scrollWidth: root.scrollWidth,
      canScroll,
      offenders,
      headline: headline ? { left: Math.round(headline.left), right: Math.round(headline.right) } : null,
      facesOutside,
    };
  });
}

async function expectNoOverflow(page: Page) {
  await expect
    .poll(async () => overflowReport(page), { timeout: 8_000 })
    .toMatchObject({ canScroll: false, offenders: [], facesOutside: [] });

  const report = await overflowReport(page);
  expect(report.scrollWidth).toBeLessThanOrEqual(report.clientWidth + 1);
  if (report.headline) {
    expect(report.headline.left).toBeGreaterThanOrEqual(-1);
    expect(report.headline.right).toBeLessThanOrEqual(report.clientWidth + 1);
  }
}

for (const path of pages) {
  for (const width of widths) {
    test(`${path} stays inside the viewport at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await appReady(page);
      await expectNoOverflow(page);
    });
  }
}
