"use client";

import { bandColors, type BandColor } from "@/lib/appearance";
import { useAppearance } from "./appearance-provider";

type Props = {
  onSelect?: (band: BandColor) => void;
  busy?: boolean;
};

export function BandPicker({ onSelect, busy = false }: Props) {
  const { band, setBand } = useAppearance();
  const choose = onSelect ?? setBand;

  return (
    <div
      className="band-picker"
      role="group"
      aria-label="Band colour"
      aria-busy={busy || undefined}
    >
      {bandColors.map((option) => (
        <button
          key={option.id}
          type="button"
          className={
            option.id === band ? "band-choice is-selected" : "band-choice"
          }
          data-band={option.id}
          aria-pressed={option.id === band}
          onClick={() => choose(option.id)}
        >
          <span className="band-choice-dot" data-band={option.id} />
          {option.label}
        </button>
      ))}
    </div>
  );
}
