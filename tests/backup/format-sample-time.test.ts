import { describe, expect, it } from "vitest";
import { formatSampleTime } from "@/lib/format-sample-time";

describe("formatSampleTime", () => {
  it("drops milliseconds from a valid ISO timestamp", () => {
    const formatted = formatSampleTime("2026-10-27T06:57:42.596Z");
    expect(formatted).not.toContain(".596");
    expect(formatted).not.toMatch(/T.*Z$/);
  });

  it("returns the original string when the value is not a date", () => {
    expect(formatSampleTime("not-a-date")).toBe("not-a-date");
  });
});
