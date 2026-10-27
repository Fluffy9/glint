/** Shared helpers for README art exports. */

export const CAPTURE_CSS = `
  [data-dev-chrome], nextjs-portal { display: none !important; }
  .home-hero { overflow: hidden !important; }
  .home-hero, .home-hero * {
    user-select: none !important;
    -webkit-user-select: none !important;
  }
  ::selection { background: transparent !important; color: inherit !important; }
`;

/** Matches the marketing hero pack shot (default -24/-36, then a left drag). */
export const HERO_PACK = { rx: -32, ry: -72 };

export async function preparePage(page, baseURL) {
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("h1.home-hero-title");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: CAPTURE_CSS });
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
}

/** Set box angles without a mouse drag so labels never get a text selection. */
export async function setPackAngles(page, rx, ry) {
  await page.evaluate(
    ({ nextRx, nextRy }) => {
      const pivot = document.querySelector(".home-hero-stage .gb-pivot");
      if (!(pivot instanceof HTMLElement)) return;
      pivot.style.setProperty("--rx", `${nextRx}deg`);
      pivot.style.setProperty("--ry", `${nextRy}deg`);
      window.getSelection()?.removeAllRanges();
    },
    { nextRx: rx, nextRy: ry },
  );
}

export async function poseHeroPack(page) {
  await setPackAngles(page, HERO_PACK.rx, HERO_PACK.ry);
  await page.waitForTimeout(80);
}

export async function packagingClip(page, pad = 28) {
  return page.evaluate((padding) => {
    const stageEl = document.querySelector(".home-hero-stage");
    if (!stageEl) return null;
    const faces = [...stageEl.querySelectorAll(".gb-face")];
    if (!faces.length) return null;
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const el of faces) {
      const r = el.getBoundingClientRect();
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    }
    return {
      x: Math.max(0, left - padding),
      y: Math.max(0, top - padding),
      width: right - left + padding * 2,
      height: bottom - top + padding * 2,
    };
  }, pad);
}

export async function pickBand(page, color) {
  await page.locator("button.band-choice:visible", { hasText: color }).click();
  await page.waitForFunction(
    (label) => {
      const theme = document.documentElement.getAttribute("data-theme") ?? "";
      return theme.startsWith(label) && !document.querySelector(".home-hero-wash.is-incoming");
    },
    color.toLowerCase(),
    { timeout: 8_000 },
  );
  // Band wipe remounts styles on the pivot — reapply the hero pose.
  await poseHeroPack(page);
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
}
