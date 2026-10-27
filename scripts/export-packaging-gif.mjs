/**
 * Capture a smooth left/right yaw of the hero pack pose into docs/readme/packaging.gif.
 * Usage: pnpm exec node scripts/export-packaging-gif.mjs
 * Expects next dev on http://127.0.0.1:3000.
 */
import { chromium } from "@playwright/test";
import { mkdir, rm, writeFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import {
  HERO_PACK,
  packagingClip,
  poseHeroPack,
  preparePage,
  setPackAngles,
} from "./readme-capture-shared.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs/readme");
const frameDir = path.join(outDir, ".gif-frames");
const baseURL = process.env.README_EXPORT_URL ?? "http://127.0.0.1:3000";
const nodeRequire = createRequire(import.meta.url);
const sharp = createRequire(nodeRequire.resolve("next/package.json"))("sharp");

const AMP = 16;
const HALF_FRAMES = 16;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/** One smooth pass left → right → left (closes the loop). */
function yawFrames() {
  const angles = [];
  for (let i = 0; i < HALF_FRAMES; i += 1) {
    const t = easeInOut(i / (HALF_FRAMES - 1));
    angles.push(HERO_PACK.ry - AMP + t * AMP * 2);
  }
  for (let i = 0; i < HALF_FRAMES; i += 1) {
    const t = easeInOut(i / (HALF_FRAMES - 1));
    angles.push(HERO_PACK.ry + AMP - t * AMP * 2);
  }
  return angles;
}

await rm(frameDir, { recursive: true, force: true });
await mkdir(frameDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

await preparePage(page, baseURL);
await poseHeroPack(page);

const yaws = yawFrames();
let union = null;
for (const ry of [HERO_PACK.ry - AMP, HERO_PACK.ry, HERO_PACK.ry + AMP]) {
  await setPackAngles(page, HERO_PACK.rx, ry);
  const box = await packagingClip(page, 0);
  if (!box) continue;
  const next = {
    left: box.x,
    top: box.y,
    right: box.x + box.width,
    bottom: box.y + box.height,
  };
  union = union
    ? {
        left: Math.min(union.left, next.left),
        top: Math.min(union.top, next.top),
        right: Math.max(union.right, next.right),
        bottom: Math.max(union.bottom, next.bottom),
      }
    : next;
}

const pad = 32;
const clip = {
  x: Math.max(0, union.left - pad),
  y: Math.max(0, union.top - pad),
  width: Math.ceil(union.right - union.left + pad * 2),
  height: Math.ceil(union.bottom - union.top + pad * 2),
};

const frames = [];
let frame = 0;

for (const ry of yaws) {
  await setPackAngles(page, HERO_PACK.rx, ry);
  const png = await page.screenshot({ type: "png", clip });
  const name = `frame-${String(frame).padStart(3, "0")}.png`;
  const file = path.join(frameDir, name);
  await sharp(png)
    .resize({ width: 480, withoutEnlargement: true })
    .png()
    .toFile(file);
  frames.push(file);
  frame += 1;
}

await browser.close();

const listFile = path.join(frameDir, "frames.txt");
await writeFile(
  listFile,
  frames.map((file) => `file '${file}'\nduration 0.06`).join("\n") + `\nfile '${frames[0]}'\n`,
);

const gifPath = path.join(outDir, "packaging.gif");
const palette = path.join(frameDir, "palette.png");
const rawGif = path.join(frameDir, "raw.gif");

await run("ffmpeg", [
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  listFile,
  "-vf",
  "palettegen=stats_mode=diff",
  palette,
]);

await run("ffmpeg", [
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  listFile,
  "-i",
  palette,
  "-lavfi",
  "paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle",
  "-loop",
  "0",
  rawGif,
]);

await run("ffmpeg", [
  "-y",
  "-i",
  rawGif,
  "-vf",
  "scale=420:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4",
  "-loop",
  "0",
  gifPath,
]);

await rm(frameDir, { recursive: true, force: true });
const info = await stat(gifPath);
console.log(`Wrote ${gifPath} (${Math.round(info.size / 1024)}K, ${frames.length} frames)`);

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}\n${err}`));
    });
  });
}
