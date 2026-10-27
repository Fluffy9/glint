import { describe, expect, it } from "vitest";
import { reviewPaint, screenMarks } from "./screen";

const marks = screenMarks();

describe("reviewPaint", () => {
  it("accepts checking followed by the full create screen", () => {
    const report = reviewPaint([marks.checking, marks.create.slice(0, 2), marks.create], {
      only: ["checking", "create"],
      settle: "create",
    });
    expect(report.ok).toBe(true);
  });

  it("accepts checking followed by unlock and rejects a create frame", () => {
    const clean = reviewPaint([marks.checking, marks.unlock], { only: ["checking", "unlock"], settle: "unlock" });
    expect(clean.ok).toBe(true);

    const flashed = reviewPaint([marks.checking, ["panel: Create a passkey"], marks.unlock], {
      only: ["checking", "unlock"],
      settle: "unlock",
    });
    expect(flashed.violation).toBe(true);
    expect(flashed.detail).toContain("create");
    expect(flashed.detail).toContain("panel: Create a passkey");
  });

  it("rejects one frame that mixes create and unlock", () => {
    const report = reviewPaint([["panel: Create a passkey", "panel: Unlock"]], {
      only: ["checking", "create", "unlock"],
      settle: "unlock",
    });
    expect(report.violation).toBe(true);
    expect(report.detail).toContain("Frame 0 is not one screen");
  });

  it("rejects a mark that is not on a screen", () => {
    const report = reviewPaint([["panel: Surprise"]], { only: ["create"], settle: "create" });
    expect(report.violation).toBe(true);
    expect(report.detail).toContain("panel: Surprise is not on any screen");
  });

  it("reports the gap when the last frame is only part of the settled screen", () => {
    const report = reviewPaint([marks.checking], { only: ["checking", "create"], settle: "create" });
    expect(report.ok).toBe(false);
    expect(report.violation).toBe(false);
    expect(report.detail).toContain("has not settled on create");
    expect(report.detail).toContain("missing:");
    expect(report.detail).toContain("panel: Create a passkey");
  });
});
