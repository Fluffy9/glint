import type { Page } from "@playwright/test";
import { reviewPaint, type PaintStory } from "../paint/screen";

export async function installPaintRecorder(page: Page) {
  await page.addInitScript(() => {
    const record = window as Window & { __paint?: string[][] };
    record.__paint = [];

    const shown = (element: Element) => {
      const box = element.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) return false;
      const style = getComputedStyle(element);
      return style.visibility !== "hidden" && style.display !== "none";
    };

    const scan = () => {
      const marks = new Set<string>();
      const addText = (root: Element) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          const text = (node.textContent || "").replace(/\s+/g, " ").trim();
          const parent = node.parentElement;
          node = walker.nextNode();
          if (!text || !parent || parent.closest(".gl-sr, .nav-mode, .account-skeleton, .site-signin-skeleton, .paint-skip")) continue;
          if (!shown(parent)) continue;
          if (parent.closest(".site-actions")) marks.add(`header: ${text}`);
          else if (parent.closest("h1")) marks.add(`title: ${text}`);
          else if (parent.closest(".account-lede")) marks.add(`lede: ${text}`);
          else marks.add(`panel: ${text}`);
        }
      };

      for (const header of document.querySelectorAll("header.site-nav, header.home-hero-nav")) {
        if (!shown(header)) continue;
        const actions = header.querySelector(".site-actions");
        if (!actions) continue;
        if (actions.querySelector(".site-signin-skeleton") && shown(actions.querySelector(".site-signin-skeleton")!)) {
          marks.add("header: Opening dashboard…");
        }
        addText(actions);
      }

      for (const shell of document.querySelectorAll("main .account-panel-shell")) {
        if (!shown(shell)) continue;
        if (shell.querySelector(".account-skeleton") && shown(shell.querySelector(".account-skeleton")!)) {
          marks.add("panel: Opening dashboard…");
        }
        addText(shell);
      }

      const rank = (mark: string) =>
        mark.startsWith("header:") ? 0 : mark.startsWith("title:") ? 1 : mark.startsWith("lede:") ? 2 : 3;
      const frame = [...marks].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
      const previous = record.__paint?.[record.__paint.length - 1];
      if (frame.length === 0 || (previous && previous.join("\n") === frame.join("\n"))) return;
      record.__paint?.push(frame);
    };

    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        scan();
      });
    };

    let armed = false;
    const arm = () => {
      const root = document.documentElement;
      if (armed || !root) return;
      armed = true;
      new MutationObserver(schedule).observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      schedule();
    };
    const waitForDocument = () => {
      if (document.documentElement) {
        arm();
        return;
      }
      requestAnimationFrame(waitForDocument);
    };
    document.addEventListener("DOMContentLoaded", arm);
    waitForDocument();
  });
}

export async function paintFrames(page: Page): Promise<string[][]> {
  return page.evaluate(() => (window as unknown as { __paint?: string[][] }).__paint ?? []);
}

async function nextFrame(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      }),
  );
}

export async function expectPaint(page: Page, story: PaintStory) {
  const deadline = Date.now() + 5_000;
  let report = reviewPaint(await paintFrames(page), story);
  while (!report.ok && !report.violation && Date.now() < deadline) {
    await nextFrame(page);
    report = reviewPaint(await paintFrames(page), story);
  }
  if (!report.ok) throw new Error(report.detail);

  await nextFrame(page);
  await nextFrame(page);
  report = reviewPaint(await paintFrames(page), story);
  if (!report.ok) throw new Error(report.detail);
}
