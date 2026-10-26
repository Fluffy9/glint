import {
  annulusPath,
  patternPath,
  type PatternId,
} from "@/lib/glint-box/patterns";

export type BoxMm = [number, number, number];

export type BoxMetrics = {
  W: number;
  D: number;
  H: number;
  W2: number;
  D2: number;
  H2: number;
  nW2: number;
  nD2: number;
  nH2: number;
  Wt: number;
  Dt: number;
  Ht: number;
  Wt2: number;
  Dt2: number;
  Ht2: number;
  nWt2: number;
  nDt2: number;
  nHt2: number;
  sl: number;
  shift: number;
  frame: number;
  patF: string;
  stripL: number;
  stripL2: number;
  stripDisplay: "block" | "none";
  coilD: number;
  coilL: number;
  coilT: number;
  coilDisplay: "block" | "none";
  clipId: string;
  annulus: string;
  patCoil: string;
  coilStroke: string;
  endMark: number;
  wordFs: number;
  capFs: number;
  markPx: number;
  gap: number;
  ts: number;
  sparkBox: number;
  spA: number;
  spB: number;
  stPadX: number;
  stPadY: number;
  stShadow: string;
  shW: number;
  shH: number;
  shL: number;
  shT: number;
};

export function boxMetrics({
  mm,
  pat,
  slide,
  outlined = false,
  scale = 3,
  id = "0",
}: {
  mm: BoxMm;
  pat: PatternId;
  slide: number;
  outlined?: boolean;
  scale?: number;
  id?: string;
}): BoxMetrics {
  const s = scale;
  const W = Math.round(mm[0] * s);
  const D = Math.round(mm[1] * s);
  const H = Math.round(mm[2] * s);
  const t = Math.max(3, Math.round(s * 1.4));
  const Wt = W - 6;
  const Dt = D - 2 * t;
  const Ht = H - 2 * t;
  const sl = Math.round(slide * W * 0.7);
  const u = s * 0.4;
  const uc = s * 0.25;
  const minSide = Math.min(W, D);
  const wordFs = Math.max(12, Math.round(minSide * 0.17));
  const capFs = Math.max(7, Math.round(minSide * 0.045));
  const visW = sl - 3;
  const R = Math.min(Dt * 0.4, visW * 0.46);
  const showCoil = R >= 14;
  const r = R * 0.62;
  const Ri = Math.max(1, Math.round(R));
  const coilD = showCoil ? 2 * Ri : 2;
  const ink = "#29252c";

  return {
    W,
    D,
    H,
    W2: W / 2,
    D2: D / 2,
    H2: H / 2,
    nW2: -W / 2,
    nD2: -D / 2,
    nH2: -H / 2,
    Wt,
    Dt,
    Ht,
    Wt2: Wt / 2,
    Dt2: Dt / 2,
    Ht2: Ht / 2,
    nWt2: -Wt / 2,
    nDt2: -Dt / 2,
    nHt2: -Ht / 2,
    sl,
    shift: -Math.round(sl / 2),
    frame: Math.max(3, Math.round(s * 2.2)),
    patF: patternPath(pat, W, H, u),
    stripL: Math.round(Wt - visW),
    stripL2: Math.round(Wt - visW) + 6,
    stripDisplay: sl > 3 ? "block" : "none",
    coilD,
    coilL: showCoil ? Math.round(Wt - visW / 2 - R) : 0,
    coilT: Math.round(Dt / 2 - R),
    coilDisplay: showCoil ? "block" : "none",
    clipId: `coil${id}`,
    annulus: showCoil ? annulusPath(Ri, r) : "M0 0",
    patCoil: showCoil ? patternPath("starLattice", coilD, coilD, uc) : "",
    coilStroke: outlined ? ink : "rgba(41,37,44,0.22)",
    endMark: Math.round(Math.min(Dt, Ht) * 0.4),
    wordFs,
    capFs,
    markPx: Math.round(wordFs * 1.1),
    gap: Math.round(wordFs * 0.4),
    ts: Math.max(2, Math.round(wordFs * 0.07)),
    sparkBox: 10,
    spA: Math.round(wordFs * 0.8),
    spB: Math.round(wordFs * 0.5),
    stPadX: Math.round(capFs * 1.0),
    stPadY: Math.round(capFs * 0.6),
    stShadow: outlined
      ? `2px 2px 0 0 ${ink}`
      : "0 2px 6px rgba(41,37,44,0.18)",
    shW: Math.round((W + D) * 0.95 + sl * 0.5),
    shH: Math.round(50 + D * 0.35),
    shL: -Math.round(((W + D) * 0.95 + sl * 0.5) / 2),
    shT: Math.round(H * 0.55 - 12),
  };
}

export const BAND_HUE = {
  lavender: 300,
  mint: 160,
  peach: 55,
  sky: 235,
} as const;

export const BAND_LABEL = {
  lavender: "Lavender",
  mint: "Mint",
  peach: "Peach",
  sky: "Sky",
} as const;

export function colorwayVars(hue: number) {
  return {
    accent: `oklch(0.82 0.09 ${hue})`,
    deep: `oklch(0.7 0.1 ${hue})`,
    hl: `oklch(0.91 0.05 ${hue})`,
    strong: `oklch(0.55 0.13 ${hue})`,
    deepink: `oklch(0.36 0.1 ${hue})`,
    bgHi: `oklch(0.97 0.018 ${hue})`,
    bgLo: `oklch(0.89 0.045 ${hue})`,
  };
}

export const BOX_SIZES: { name: string; mm: BoxMm }[] = [
  { name: "Band box · 110×110×60", mm: [110, 110, 60] },
  { name: "Gift · 160×160×90", mm: [160, 160, 90] },
  { name: "Bundle · 220×140×80", mm: [220, 140, 80] },
  { name: "Cube · 120", mm: [120, 120, 120] },
];
