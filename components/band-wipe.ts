"use client";

import {
  useCallback,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type CSSProperties,
} from "react";
import type { AppearanceMode, BandColor } from "@/lib/appearance";
import { BAND_HUE, colorwayVars } from "@/lib/glint-box/metrics";

export type Wipe = { from: BandColor; to: BandColor };

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function washStyle(band: BandColor, mode: AppearanceMode): CSSProperties {
  const colors = colorwayVars(BAND_HUE[band]);
  const dark = mode === "dark";
  return {
    "--wash-hi": dark ? colors.bgHiDark : colors.bgHi,
    "--wash-lo": dark ? colors.bgLoDark : colors.bgLo,
  } as CSSProperties;
}

export function boxPaint(band: BandColor): CSSProperties {
  const colors = colorwayVars(BAND_HUE[band]);
  return {
    "--gb-accent": colors.accent,
    "--gb-deep": colors.deep,
    "--gb-hl": colors.hl,
    "--gb-strong": colors.strong,
    "--gb-deepink": colors.deepink,
  } as CSSProperties;
}

export function useBandWipe(band: BandColor, setBand: (next: BandColor) => void) {
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const wipeRef = useRef<Wipe | null>(null);
  const pendingRef = useRef<BandColor | null>(null);
  const bandRef = useRef(band);
  bandRef.current = band;
  wipeRef.current = wipe;

  const chooseBand = useCallback(
    (next: BandColor) => {
      const active = wipeRef.current;
      const showing = active?.to ?? bandRef.current;
      if (next === showing) {
        pendingRef.current = null;
        return;
      }
      if (prefersReducedMotion()) {
        pendingRef.current = null;
        wipeRef.current = null;
        setWipe(null);
        setBand(next);
        return;
      }
      if (active) {
        pendingRef.current = next;
        return;
      }
      const started = { from: bandRef.current, to: next };
      wipeRef.current = started;
      setWipe(started);
    },
    [setBand],
  );

  const finishWipe = useCallback(
    (event: ReactAnimationEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      if (!event.animationName.includes("heroColorWipe")) return;
      const current = wipeRef.current;
      if (!current) return;
      const queued = pendingRef.current;
      pendingRef.current = null;
      setBand(current.to);
      if (queued && queued !== current.to) {
        const follow = { from: current.to, to: queued };
        wipeRef.current = follow;
        setWipe(follow);
      } else {
        wipeRef.current = null;
        setWipe(null);
      }
    },
    [setBand],
  );

  return { wipe, paintBand: wipe?.to ?? band, chooseBand, finishWipe };
}
