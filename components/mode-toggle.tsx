"use client";

import { useAppearance } from "./appearance-provider";

export function ModeToggle() {
  const { mode, setMode } = useAppearance();
  const next = mode === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className="gl-btn gl-btn-ghost gl-btn-sm"
      aria-pressed={mode === "dark"}
      aria-label={`Switch to ${next} mode`}
      onClick={() => setMode(next)}
    >
      {mode === "light" ? "Dark" : "Light"}
    </button>
  );
}
