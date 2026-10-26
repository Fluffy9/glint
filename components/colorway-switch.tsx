"use client";

import { useState } from "react";

const bands = [
  { id: "lavender-light", label: "Lavender" },
  { id: "mint-light", label: "Mint" },
  { id: "peach-light", label: "Peach" },
  { id: "sky-light", label: "Sky" },
] as const;

export function ColorwaySwitch() {
  const [theme, setTheme] = useState<(typeof bands)[number]["id"]>("lavender-light");

  function choose(id: (typeof bands)[number]["id"]) {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
  }

  return (
    <div className="colorways" role="group" aria-label="Band colour">
      {bands.map((band) => (
        <button
          key={band.id}
          type="button"
          className={band.id === theme ? "gl-chip is-selected" : "gl-chip"}
          aria-pressed={band.id === theme}
          onClick={() => choose(band.id)}
        >
          {band.label}
        </button>
      ))}
    </div>
  );
}
