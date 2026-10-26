/** Pattern path generators from packaging/glint-box. */

const SP: [number, number][] = [
  [50, 0],
  [53, 35],
  [65, 47],
  [100, 50],
  [65, 53],
  [53, 65],
  [50, 100],
  [47, 65],
  [35, 53],
  [0, 50],
  [35, 47],
  [47, 35],
  [50, 0],
];

function f(n: number) {
  return String(Math.round(n * 10) / 10);
}

function pts(cx: number, cy: number, r: number) {
  const k = r / 50;
  return SP.map((a) => `${f(cx + (a[0] - 50) * k)} ${f(cy + (a[1] - 50) * k)}`);
}

function path(q: string[]) {
  return `M${q[0]}C${q[1]} ${q[2]} ${q[3]}C${q[4]} ${q[5]} ${q[6]}C${q[7]} ${q[8]} ${q[9]}C${q[10]} ${q[11]} ${q[12]}Z`;
}

function sparklePath(cx: number, cy: number, r: number) {
  return path(pts(cx, cy, r));
}

function sparklePathReverse(cx: number, cy: number, r: number) {
  return path(pts(cx, cy, r).reverse());
}

function sq(x: number, y: number, w: number, h?: number) {
  const hh = h === undefined ? w : h;
  return `M${f(x)} ${f(y)}h${f(w)}v${f(hh)}h${f(-w)}Z`;
}

function circ(cx: number, cy: number, r: number) {
  return `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
}

function dia(cx: number, cy: number, r: number) {
  return `M${f(cx)} ${f(cy - r)}L${f(cx + r)} ${f(cy)}L${f(cx)} ${f(cy + r)}L${f(cx - r)} ${f(cy)}Z`;
}

type WarpOpts = { c: number; N?: number; rot?: number; spark?: boolean };

function warp(W: number, H: number, u: number, o: WarpOpts) {
  const c = o.c * u;
  const a = c * 0.3;
  const T = Math.PI * 2;
  const N = o.N || 8;
  let d = "";
  const dx = (y: number) =>
    a * Math.sin((T * y) / (c * 4) + 0.7) +
    0.4 * a * Math.sin((T * y) / (c * 2) + 2);
  const dy = (x: number) =>
    a * Math.sin((T * x) / (c * 8) + 1.3) +
    0.4 * a * Math.sin((T * x) / (c * 3) + 0.2);
  const rot = ((o.rot || 0) * Math.PI) / 180;
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  const mx = W / 2;
  const my = H / 2;
  const Qp = (x: number, y: number): [number, number] => {
    const px = x + dx(y);
    const py = y + dy(x);
    if (!rot) return [px, py];
    const qx = px - mx;
    const qy = py - my;
    return [mx + qx * cr - qy * sr, my + qx * sr + qy * cr];
  };
  const Q = (x: number, y: number) => {
    const p = Qp(x, y);
    return `${f(p[0])} ${f(p[1])}`;
  };
  let i0 = -1;
  let i1 = Math.ceil(W / c);
  let j0 = -1;
  let j1 = Math.ceil(H / c);
  if (rot) {
    const R = Math.ceil(Math.sqrt(W * W + H * H) / 2 / c) + 2;
    i0 = Math.floor(mx / c) - R;
    i1 = Math.ceil(mx / c) + R;
    j0 = Math.floor(my / c) - R;
    j1 = Math.ceil(my / c) + R;
  }
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      if ((((i + j) % 2) + 2) % 2) continue;
      const x0 = i * c;
      const y0 = j * c;
      const q: string[] = [];
      for (let t = 0; t < N; t++) q.push(Q(x0 + (c * t) / N, y0));
      for (let t = 0; t < N; t++) q.push(Q(x0 + c, y0 + (c * t) / N));
      for (let t = 0; t < N; t++) q.push(Q(x0 + c - (c * t) / N, y0 + c));
      for (let t = 0; t < N; t++) q.push(Q(x0, y0 + c - (c * t) / N));
      d += `M${q.join("L")}Z`;
      if (o.spark && ((((i * 73 + j * 151) % 9) + 9) % 9) === 0) {
        const p = Qp(x0 + c / 2, y0 + c / 2);
        d += sparklePathReverse(p[0], p[1], c * 0.34);
      }
    }
  }
  return d;
}

export const PATTERN_IDS = [
  "plain",
  "warpCheck",
  "warpFine",
  "warpDiag",
  "warpSpark",
  "starLattice",
  "pixelField",
  "sparklePlus",
  "houndstooth",
  "bubbles",
  "wiggle",
] as const;

export type PatternId = (typeof PATTERN_IDS)[number];

export const PATTERN_LABELS: Record<PatternId, string> = {
  plain: "Plain",
  warpCheck: "Wavy check · large",
  warpFine: "Wavy check · fine",
  warpDiag: "Wavy check · diagonal",
  warpSpark: "Wavy check · sparkle cut",
  starLattice: "Star lattice",
  pixelField: "Pixel field",
  sparklePlus: "Sparkle & plus",
  houndstooth: "Houndstooth",
  bubbles: "Bubbles",
  wiggle: "Wiggle",
};

const generators: Record<
  PatternId,
  (W: number, H: number, u: number) => string
> = {
  plain: () => "",
  warpCheck: (W, H, u) => warp(W, H, u, { c: 25 }),
  warpFine: (W, H, u) => warp(W, H, u, { c: 13, N: 5 }),
  warpDiag: (W, H, u) => warp(W, H, u, { c: 24, rot: 45, N: 6 }),
  warpSpark: (W, H, u) => warp(W, H, u, { c: 30, spark: true }),
  sparklePlus: (W, H, u) => {
    const p = 28 * u;
    let d = "";
    for (let y = -p; y <= H + p; y += p) {
      for (let x = -p; x <= W + p; x += p) {
        d += sparklePath(x, y, 6 * u);
        const a = 4 * u;
        const t = 1.8 * u;
        const cx = x + p / 2;
        const cy = y + p / 2;
        d += sq(cx - a, cy - t / 2, 2 * a, t) + sq(cx - t / 2, cy - a, t, 2 * a);
      }
    }
    return d;
  },
  houndstooth: (W, H, u) => {
    const q = 6 * u;
    let d = "";
    const cols = Math.ceil(W / q) + 1;
    const rows = Math.ceil(H / q) + 1;
    for (let j = 0; j < rows; j++) {
      let run = -1;
      for (let i = 0; i <= cols; i++) {
        const up = (i + j) % 4 < 2;
        const dark =
          i <= cols - 1 && (up ? i % 8 < 4 : j % 8 < 4);
        if (dark && run < 0) run = i;
        if (!dark && run >= 0) {
          d += sq(run * q, j * q, (i - run) * q, q);
          run = -1;
        }
      }
    }
    return d;
  },
  wiggle: (W, H, u) => {
    const s = 18 * u;
    const a = 4 * u;
    const L = 24 * u;
    const t = 3.6 * u;
    let d = "";
    for (let y0 = -s; y0 <= H + s; y0 += s) {
      const top: string[] = [];
      const bot: string[] = [];
      for (let x = -L; x <= W + L; x += L / 8) {
        const y = y0 + a * Math.sin((2 * Math.PI * x) / L);
        top.push(`${f(x)} ${f(y - t / 2)}`);
        bot.unshift(`${f(x)} ${f(y + t / 2)}`);
      }
      d += `M${top.join("L")}L${bot.join("L")}Z`;
    }
    return d;
  },
  starLattice: (W, H, u) => {
    const p = 22 * u;
    let d = "";
    for (let y = -p; y <= H + p; y += p) {
      for (let x = -p; x <= W + p; x += p) {
        d += sparklePath(x, y, 7.5 * u) + dia(x + p / 2, y + p / 2, 2.4 * u);
      }
    }
    return d;
  },
  bubbles: (W, H, u) => {
    const T = 64 * u;
    const C = [
      [8, 10, 5],
      [30, 6, 2.5],
      [48, 18, 7],
      [14, 38, 3],
      [36, 34, 4.5],
      [58, 44, 2.5],
      [24, 56, 6],
      [50, 58, 3.5],
      [4, 58, 2],
    ];
    const S = [
      [40, 46, 5],
      [10, 24, 4],
    ];
    let d = "";
    for (let ty = -T; ty <= H + T; ty += T) {
      for (let tx = -T; tx <= W + T; tx += T) {
        for (const c of C) d += circ(tx + c[0] * u, ty + c[1] * u, c[2] * u);
        for (const c of S)
          d += sparklePath(tx + c[0] * u, ty + c[1] * u, c[2] * u * 1.3);
      }
    }
    return d;
  },
  pixelField: (W, H, u) => {
    const q = 2.6 * u;
    const n = 7;
    const p = 34 * u;
    const rowH = p * 0.75;
    let d = "";
    const cells: [number, number][] = [];
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const a = Math.abs((i + 0.5) / n - 0.5) * 2;
        const b = Math.abs((j + 0.5) / n - 0.5) * 2;
        if (Math.pow(a, 0.6) + Math.pow(b, 0.6) <= 1.02) cells.push([i, j]);
      }
    }
    for (let r = -1; r * rowH <= H + rowH; r++) {
      const y = r * rowH;
      const off = ((r % 2) + 2) % 2 ? p / 2 : 0;
      for (let x = off - p; x <= W + p; x += p) {
        for (const c of cells) {
          d += sq(x - (n * q) / 2 + c[0] * q, y - (n * q) / 2 + c[1] * q, q);
        }
        d += sq(x + p / 2 - q * 0.6, y - q * 0.6, q * 1.2);
      }
    }
    return d;
  },
};

const cache = new Map<string, string>();

export function patternPath(
  name: PatternId,
  W: number,
  H: number,
  u: number,
): string {
  const key = `${name}:${W}:${H}:${u}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const d = generators[name](W, H, u);
  cache.set(key, d);
  return d;
}

export function annulusPath(R: number, r: number) {
  return circ(R, R, R) + circ(R, R, r);
}

export const MARK_PATH = sparklePath(50, 50, 50);
