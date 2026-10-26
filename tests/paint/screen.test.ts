import { describe, expect, it } from "vitest";
import { reviewPaint, screenMarks } from "./screen";

const email = "buyer@example.com";
const marks = screenMarks(email);

describe("reviewPaint", () => {
  it("accepts checking followed by the full signed-out screen", () => {
    const report = reviewPaint([marks.checking, marks.out.slice(0, 2), marks.out], {
      only: ["checking", "out"],
      settle: "out",
    });
    expect(report.ok).toBe(true);
  });

  it("accepts checking followed by the full signed-in screen and rejects a signed-out frame", () => {
    const clean = reviewPaint([marks.checking, marks.in], { only: ["checking", "in"], settle: "in" });
    expect(clean.ok).toBe(true);

    const flashed = reviewPaint([marks.checking, ["header: Sign in"], marks.in], {
      only: ["checking", "in"],
      settle: "in",
    });
    expect(flashed.violation).toBe(true);
    expect(flashed.detail).toContain("signed out");
    expect(flashed.detail).toContain("header: Sign in");
  });

  it("rejects one frame that mixes two screens", () => {
    const report = reviewPaint(
      [["header: Sign in", "panel: Checking sign-in…", "panel: Signed in as buyer@example.com"]],
      { only: ["checking", "out", "in"], settle: "in" },
    );
    expect(report.violation).toBe(true);
    expect(report.detail).toContain("Frame 0 is not one screen");
    expect(report.detail).toContain("header: Sign in belongs on signed out");
    expect(report.detail).toContain("panel: Checking sign-in… belongs on checking");
    expect(report.detail).toContain("panel: Signed in as buyer@example.com belongs on signed in");
  });

  it("rejects a mark that is not on a screen", () => {
    const report = reviewPaint([["panel: Surprise"]], { only: ["out"], settle: "out" });
    expect(report.violation).toBe(true);
    expect(report.detail).toContain("panel: Surprise is not on any screen");
  });

  it("reports the gap when the last frame is only part of the settled screen", () => {
    const report = reviewPaint([marks.checking], { only: ["checking", "out"], settle: "out" });
    expect(report.ok).toBe(false);
    expect(report.violation).toBe(false);
    expect(report.detail).toContain("has not settled on signed out");
    expect(report.detail).toContain("missing:");
    expect(report.detail).toContain("header: Sign in");
  });
});
