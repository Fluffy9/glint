"use client";

import { bandColors } from "@/lib/appearance";
import { useAppearance } from "./appearance-provider";

export function BandPicker() {
  const { band, setBand } = useAppearance();

  return (
    <div className="band-picker" role="group" aria-label="Band colour">
      {bandColors.map((option) => (
        <button
          key={option.id}
          type="button"
          className={
            option.id === band ? "band-choice is-selected" : "band-choice"
          }
          data-band={option.id}
          aria-pressed={option.id === band}
          onClick={() => setBand(option.id)}
        >
          <span className="band-choice-dot" data-band={option.id} />
          {option.label}
        </button>
      ))}
    </div>
  );
}
