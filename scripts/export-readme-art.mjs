/**
 * Capture marketing art from the running site into docs/readme/.
 * Usage: pnpm exec node scripts/export-readme-art.mjs
 * Expects next dev on http://127.0.0.1:3000.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  packagingClip,
  pickBand,
  poseHeroPack,
  preparePage,
} from "./readme-capture-shared.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs/readme");
const baseURL = process.env.README_EXPORT_URL ?? "http://127.0.0.1:3000";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

await preparePage(page, baseURL);
await poseHeroPack(page);

async function shotPackaging(name) {
  const clip = await packagingClip(page);
  if (!clip) return;
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
  await page.screenshot({
    path: path.join(outDir, name),
    type: "png",
    clip,
  });
}

for (const color of ["Lavender", "Mint", "Peach", "Sky"]) {
  await pickBand(page, color);
  await shotPackaging(`packaging-${color.toLowerCase()}.png`);
}

await pickBand(page, "Lavender");
await page.locator(".home-hero").screenshot({
  path: path.join(outDir, "hero.png"),
  type: "png",
});

await browser.close();
console.log(`Wrote art into ${outDir}`);
