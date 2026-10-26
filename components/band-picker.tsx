"use client";

import { bandColors } from "@/lib/appearance";
import { useAppearance } from "./appearance-provider";

export function BandPicker() {
  const { band, setBand } = useAppearance();

  return (
    <div className="band-picker" role="group" aria-label="Band colour">
      <p className="gl-field-label">Band colour</p>
      <div className="band-swatches">
        {bandColors.map((option) => (
          <button
            key={option.id}
            type="button"
            className={
              option.id === band ? "band-swatch is-selected" : "band-swatch"
            }
            data-band={option.id}
            aria-pressed={option.id === band}
            aria-label={option.label}
            title={option.label}
            onClick={() => setBand(option.id)}
          />
        ))}
      </div>
      <p className="fine band-picker-note">
        The page accent follows the band you pick. Light and dark are separate.
      </p>
    </div>
  );
}
