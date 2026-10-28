"use client";

import { memo, useEffect, useId, useRef } from "react";
import type { AppearanceMode, BandColor } from "@/lib/appearance";
import {
  HALFTONE_COVER_FRAME,
  HALFTONE_DOTS,
  HALFTONE_FRAME_MS,
  HALFTONE_RADII,
} from "@/lib/halftone-diagonal";
import { washStyle } from "@/components/band-wipe";

type Props = {
  band: BandColor;
  mode: AppearanceMode;
  onCovered: () => void;
  onDone: () => void;
};

/**
 * Incoming wash, revealed by the diagonal halftone.
 * Dots grow until they cover the hero, then shrink in the same order.
 */
export const HalftoneWipe = memo(function HalftoneWipe({ band, mode, onCovered, onDone }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const onCoveredRef = useRef(onCovered);
  const onDoneRef = useRef(onDone);
  onCoveredRef.current = onCovered;
  onDoneRef.current = onDone;
  const maskId = useId().replace(/:/g, "");
  const gradientId = `${maskId}-wash`;

  useEffect(() => {
    const circles = svgRef.current?.querySelectorAll<SVGCircleElement>("circle");
    if (!circles?.length) return;
    const started = performance.now();
    let frame = -1;
    let covered = false;
    let raf = 0;

    const step = (now: number) => {
      const elapsed = now - started;
      const next = Math.min(HALFTONE_RADII[0].length - 1, Math.floor(elapsed / HALFTONE_FRAME_MS));
      if (next !== frame) {
        frame = next;
        for (const circle of circles) {
          const diag = Number(circle.getAttribute("data-d"));
          circle.setAttribute("r", String(HALFTONE_RADII[diag][frame]));
        }
      }
      if (!covered && frame >= HALFTONE_COVER_FRAME) {
        covered = true;
        onCoveredRef.current();
      }
      if (elapsed < HALFTONE_RADII[0].length * HALFTONE_FRAME_MS) {
        raf = requestAnimationFrame(step);
      } else {
        onDoneRef.current();
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="home-hero-halftone is-incoming"
      style={washStyle(band, mode)}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="var(--wash-hi)" />
          <stop offset="100%" stopColor="var(--wash-lo)" />
        </radialGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-64" y="-64" width="2048" height="1216">
          {HALFTONE_DOTS.map(([x, y, diag]) => (
            <circle key={`${x}-${y}`} data-d={diag} cx={x} cy={y} r={0} fill="white" />
          ))}
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect width="1920" height="1080" fill="var(--wash-lo)" />
        <ellipse cx="960" cy="454" rx="1344" ry="648" fill={`url(#${gradientId})`} />
      </g>
    </svg>
  );
});
