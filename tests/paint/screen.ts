import { copy } from "@/content";

export type Screen = "checking" | "create" | "unlock" | "needs-recovery";

const screenName: Record<Screen, string> = {
  checking: "checking",
  create: "create",
  unlock: "unlock",
  "needs-recovery": "needs recovery",
};

/** Every visible dashboard mark, in reading order. A frame may be a subset of one screen. The settled frame must be the whole screen. */
export function screenMarks(): Record<Screen, string[]> {
  const title = "title: Dashboard";
  const lede = `lede: ${copy.dashboard.lede}`;
  const header = "header: Dashboard";
  const recovery = `panel: ${copy.dashboard.haveRecovery}`;
  return {
    checking: [header, title, lede, "panel: Opening dashboard…"],
    create: [header, title, lede, `panel: ${copy.dashboard.create}`, recovery],
    unlock: [header, title, lede, `panel: ${copy.dashboard.unlock}`, recovery],
    "needs-recovery": [
      header,
      title,
      lede,
      `panel: ${copy.dashboard.noPasskey}`,
      `panel: ${copy.dashboard.pasteRecovery}`,
    ],
  };
}

export type PaintStory = {
  /** Screens this visit is allowed to paint, from the first frame. */
  only: Screen[];
  /** The visit is done when the last frame is this entire screen. */
  settle: Screen;
  /** Ignore frames recorded before this index. */
  from?: number;
};

export type PaintReport = {
  ok: boolean;
  violation: boolean;
  detail: string;
};

function owners(marks: Record<Screen, string[]>, mark: string): Screen[] {
  return (Object.keys(marks) as Screen[]).filter((screen) => marks[screen].includes(mark));
}

function rank(mark: string): number {
  if (mark.startsWith("header:")) return 0;
  if (mark.startsWith("title:")) return 1;
  if (mark.startsWith("lede:")) return 2;
  return 3;
}

function ordered(marks: string[]): string[] {
  return [...marks].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

function sameMarks(left: string[], right: string[]): boolean {
  const a = ordered(left);
  const b = ordered(right);
  return a.length === b.length && a.every((mark, index) => mark === b[index]);
}

function formatList(marks: string[]): string {
  const lines = ordered(marks);
  return lines.length ? lines.map((mark) => `    ${mark}`).join("\n") : "    (nothing)";
}

export function reviewPaint(frames: string[][], story: PaintStory): PaintReport {
  const marks = screenMarks();
  const slice = frames.slice(story.from ?? 0);
  const problems: string[] = [];
  let violation = false;
  let last: string[] | null = null;

  for (let index = 0; index < slice.length; index += 1) {
    const frame = slice[index];
    if (frame.length === 0) continue;
    const at = (story.from ?? 0) + index;
    const unknown = frame.filter((mark) => owners(marks, mark).length === 0);
    const fits = (Object.keys(marks) as Screen[]).filter((screen) => frame.every((mark) => marks[screen].includes(mark)));

    if (unknown.length > 0 || fits.length === 0) {
      violation = true;
      const lines = [`Frame ${at} is not one screen.`, "  on screen:", formatList(frame)];
      for (const mark of frame) {
        const home = owners(marks, mark);
        lines.push(
          home.length === 0
            ? `  ${mark} is not on any screen`
            : `  ${mark} belongs on ${home.map((screen) => screenName[screen]).join(" and ")}`,
        );
      }
      problems.push(lines.join("\n"));
      continue;
    }

    if (fits.length > 1) continue;

    const screen = fits[0];
    last = frame;
    if (!story.only.includes(screen)) {
      violation = true;
      problems.push(
        [
          `Frame ${at} painted the ${screenName[screen]} screen. This visit may only paint ${story.only.map((item) => screenName[item]).join(" or ")}.`,
          "  on screen:",
          formatList(frame),
        ].join("\n"),
      );
    }
  }

  const supposed = marks[story.settle];
  const settled = !violation && last !== null && sameMarks(last, supposed);
  if (!violation && !settled) {
    const onScreen = last ?? [];
    const missing = supposed.filter((mark) => !onScreen.includes(mark));
    const extra = onScreen.filter((mark) => !supposed.includes(mark));
    problems.push(
      [
        `The screen has not settled on ${screenName[story.settle]}.`,
        "  supposed:",
        formatList(supposed),
        "  on screen:",
        formatList(onScreen),
        "  missing:",
        formatList(missing),
        "  extra:",
        formatList(extra),
      ].join("\n"),
    );
  }

  return {
    ok: settled,
    violation,
    detail: problems.join("\n\n") || "ok",
  };
}
