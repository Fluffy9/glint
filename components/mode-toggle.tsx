"use client";

import { copy, fill } from "@/content";
import { useAppearance } from "./appearance-provider";

export function ModeToggle() {
  const { mode, setMode } = useAppearance();
  const next = mode === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className="nav-mode"
      aria-pressed={mode === "dark"}
      aria-label={fill(copy.nav.switchMode, { mode: next })}
      onClick={() => setMode(next)}
    >
      {mode === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg
      className="nav-glyph"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M19.5 14.5A8 8 0 1 1 9.5 4.5A6.5 6.5 0 0 0 19.5 14.5Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className="nav-glyph"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.9 4.9L7 7M17 17L19.1 19.1M19.1 4.9L17 7M7 17L4.9 19.1" />
    </svg>
  );
}
