import { MARK_PATH } from "@/lib/glint-box/patterns";

type Props = {
  cols?: number;
  rows?: number;
  cell?: number;
  amp?: number;
  seed?: number;
  stars?: boolean;
  className?: string;
};

function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function geometry(options: Required<Omit<Props, "className">>) {
  const { cols, rows, cell, amp, seed, stars } = options;
  const width = cols * cell;
  const height = rows * cell;
  const random = rng(seed);
  const tau = Math.PI * 2;
  const a1 = amp * cell;
  const a2 = a1 * 0.45;
  const k = 1 + Math.floor(random() * 2);
  const px1 = random() * tau;
  const px2 = random() * tau;
  const py1 = random() * tau;
  const py2 = random() * tau;

  const dx = (y: number) =>
    a1 * Math.sin((tau * k * y) / height + px1) +
    a2 * Math.sin((tau * (k + 1) * y) / height + px2);
  const dy = (x: number) =>
    a1 * Math.sin((tau * k * x) / width + py1) +
    a2 * Math.sin((tau * (k + 1) * x) / width + py2);
  const point = (x: number, y: number): [number, number] => [x + dx(y), y + dy(x)];

  const steps = 10;
  const cells: string[] = [];
  const sparkles: { x: number; y: number; s: number }[] = [];

  for (let j = -1; j <= rows; j += 1) {
    for (let i = -1; i <= cols; i += 1) {
      if ((((i + j) % 2) + 2) % 2 !== 0) continue;
      const x0 = i * cell;
      const y0 = j * cell;
      const x1 = x0 + cell;
      const y1 = y0 + cell;
      const pts: [number, number][] = [];
      for (let t = 0; t < steps; t += 1) pts.push(point(x0 + ((x1 - x0) * t) / steps, y0));
      for (let t = 0; t < steps; t += 1) pts.push(point(x1, y0 + ((y1 - y0) * t) / steps));
      for (let t = 0; t < steps; t += 1) pts.push(point(x1 - ((x1 - x0) * t) / steps, y1));
      for (let t = 0; t < steps; t += 1) pts.push(point(x0, y1 - ((y1 - y0) * t) / steps));
      cells.push(
        `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`,
      );
      if (
        stars &&
        i > 0 &&
        j > 0 &&
        i < cols - 1 &&
        j < rows - 1 &&
        random() < 0.3
      ) {
        const center = point(x0 + cell / 2, y0 + cell / 2);
        const size = cell * (random() < 0.5 ? 0.34 : 0.22);
        sparkles.push({
          x: center[0] - size / 2,
          y: center[1] - size / 2,
          s: size,
        });
      }
    }
  }

  return { width, height, cells: cells.join(""), stars: sparkles };
}

export function WarpCheck({
  cols = 8,
  rows = 8,
  cell = 40,
  amp = 0.28,
  seed = 7,
  stars = true,
  className,
}: Props) {
  const evenCols = cols % 2 ? cols + 1 : cols;
  const evenRows = rows % 2 ? rows + 1 : rows;
  const g = geometry({
    cols: evenCols,
    rows: evenRows,
    cell,
    amp,
    seed,
    stars,
  });

  return (
    <svg
      className={["gl-warp", className].filter(Boolean).join(" ")}
      width={g.width}
      height={g.height}
      viewBox={`0 0 ${g.width} ${g.height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect className="gl-warp-ground" width={g.width} height={g.height} />
      <path className="gl-warp-cell" d={g.cells} />
      {g.stars.map((star, index) => (
        <path
          key={index}
          className="gl-warp-star"
          d={MARK_PATH}
          transform={`translate(${star.x.toFixed(1)} ${star.y.toFixed(1)}) scale(${(star.s / 100).toFixed(3)})`}
        />
      ))}
    </svg>
  );
}
