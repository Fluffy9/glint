"use client";

import { BOX_SIZES, type BoxMm } from "@/lib/glint-box/metrics";
import { PATTERN_IDS, PATTERN_LABELS, type PatternId } from "@/lib/glint-box/patterns";
import type { ReactNode } from "react";

type Props = {
  slide: number;
  pat: PatternId;
  mm: BoxMm;
  accent: string;
  onSlide: (slide: number) => void;
  onPat: (pat: PatternId) => void;
  onMm: (mm: BoxMm) => void;
};

export function PackagingDev({
  slide,
  pat,
  mm,
  accent,
  onSlide,
  onPat,
  onMm,
}: Props) {
  return (
    <div className="home-hero-dev" aria-label="Packaging controls">
      <DevRow label="Tray">
        {(
          [
            [0, "Closed"],
            [0.5, "Half"],
            [1, "Open"],
          ] as const
        ).map(([value, name]) => (
          <DevChip
            key={name}
            selected={slide === value}
            accent={accent}
            onClick={() => onSlide(value)}
          >
            {name}
          </DevChip>
        ))}
      </DevRow>
      <DevRow label="Side accent">
        {PATTERN_IDS.map((id) => (
          <DevChip
            key={id}
            selected={pat === id}
            accent={accent}
            onClick={() => onPat(id)}
          >
            {PATTERN_LABELS[id]}
          </DevChip>
        ))}
      </DevRow>
      <DevRow label="Size">
        {BOX_SIZES.map((size) => (
          <DevChip
            key={size.name}
            selected={
              size.mm[0] === mm[0] && size.mm[1] === mm[1] && size.mm[2] === mm[2]
            }
            accent={accent}
            onClick={() => onMm(size.mm)}
          >
            {size.name}
          </DevChip>
        ))}
      </DevRow>
    </div>
  );
}

function DevRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="home-hero-dev-row">
      <span className="home-hero-dev-label">{label}</span>
      <div className="home-hero-dev-chips">{children}</div>
    </div>
  );
}

function DevChip({
  selected,
  onClick,
  accent,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  accent: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="home-hero-dev-chip"
      aria-pressed={selected}
      onClick={onClick}
      style={{ background: selected ? accent : "#fffaf2" }}
    >
      {children}
    </button>
  );
}
