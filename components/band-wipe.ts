"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
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
  const [covered, setCovered] = useState(false);
  const wipeRef = useRef<Wipe | null>(null);
  const coveredRef = useRef(false);
  const pendingRef = useRef<BandColor | null>(null);
  const bandRef = useRef(band);
  bandRef.current = band;
  wipeRef.current = wipe;
  coveredRef.current = covered;

  const chooseBand = useCallback(
    (next: BandColor) => {
      const active = wipeRef.current;
      const showing = pendingRef.current ?? active?.to ?? bandRef.current;
      if (next === showing) {
        pendingRef.current = null;
        return;
      }
      // Selection and theme update on click; the wash still wipes underneath.
      setBand(next);
      if (prefersReducedMotion()) {
        pendingRef.current = null;
        wipeRef.current = null;
        coveredRef.current = false;
        setCovered(false);
        setWipe(null);
        return;
      }
      if (active) {
        pendingRef.current = next;
        return;
      }
      const started = { from: bandRef.current, to: next };
      wipeRef.current = started;
      coveredRef.current = false;
      setCovered(false);
      setWipe(started);
    },
    [setBand],
  );

  const coverWipe = useCallback(() => {
    const current = wipeRef.current;
    if (!current || coveredRef.current) return;
    coveredRef.current = true;
    setCovered(true);
  }, []);

  const finishWipe = useCallback(() => {
    const current = wipeRef.current;
    if (!current) return;
    const queued = pendingRef.current;
    pendingRef.current = null;
    if (queued && queued !== current.to) {
      const follow = { from: current.to, to: queued };
      wipeRef.current = follow;
      coveredRef.current = false;
      setCovered(false);
      setWipe(follow);
    } else {
      wipeRef.current = null;
      coveredRef.current = false;
      setCovered(false);
      setWipe(null);
    }
  }, []);

  return { wipe, covered, paintBand: wipe?.to ?? band, chooseBand, coverWipe, finishWipe };
}
