import { describe, expect, it } from "vitest";
import {
  APPEARANCE_KEY,
  appearanceBootScript,
  readAppearance,
  readAppearanceCookie,
} from "@/lib/appearance-store";

function memoryStorage(seed: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(seed));
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key() {
      return null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe("appearance store", () => {
  it("round-trips band and mode", () => {
    const storage = memoryStorage();
    storage.setItem(APPEARANCE_KEY, JSON.stringify({ band: "mint", mode: "dark" }));
    expect(readAppearance(storage)).toEqual({ band: "mint", mode: "dark" });
  });

  it("ignores unknown bands and modes", () => {
    const storage = memoryStorage({
      "glint-appearance": JSON.stringify({ band: "neon", mode: "dark" }),
    });
    expect(readAppearance(storage)).toBeNull();
    storage.setItem("glint-appearance", JSON.stringify({ band: "mint", mode: "dim" }));
    expect(readAppearance(storage)).toBeNull();
  });

  it("parses the cookie the layout reads on the server", () => {
    const raw = encodeURIComponent(JSON.stringify({ band: "sky", mode: "dark" }));
    expect(readAppearanceCookie(raw)).toEqual({ band: "sky", mode: "dark" });
    expect(readAppearanceCookie(JSON.stringify({ band: "sky", mode: "dark" }))).toEqual({
      band: "sky",
      mode: "dark",
    });
  });

  it("ships a boot script that reads the same storage key", () => {
    expect(appearanceBootScript).toContain(APPEARANCE_KEY);
    expect(appearanceBootScript).toContain("data-theme");
  });
});
