"use client";

import Link from "next/link";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { BandPicker } from "@/components/band-picker";
import { PackagingDev } from "@/components/glint-box/packaging-dev";
import { SlideBox } from "@/components/glint-box/slide-box";
import { SiteLinks } from "@/components/site-links";
import { useAppearance } from "@/components/appearance-provider";
import {
  BAND_HUE,
  BAND_LABEL,
  boxMetrics,
  colorwayVars,
  type BoxMm,
} from "@/lib/glint-box/metrics";
import { MARK_PATH, type PatternId } from "@/lib/glint-box/patterns";

const isDev = process.env.NODE_ENV === "development";

type Props = {
  priceNote: string;
};

export function HomeHero({ priceNote }: Props) {
  const { band } = useAppearance();
  const hue = BAND_HUE[band];
  const colors = colorwayVars(hue);

  const [rx, setRx] = useState(-24);
  const [ry, setRy] = useState(-36);
  const [slide, setSlide] = useState(0);
  const [pat, setPat] = useState<PatternId>("warpSpark");
  const [mm, setMm] = useState<BoxMm>([110, 110, 60]);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(
    null,
  );

  const metrics = useMemo(
    () => boxMetrics({ mm, pat, slide, id: "hero" }),
    [mm, pat, slide],
  );

  const onDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      drag.current = { x: e.clientX, y: e.clientY, rx, ry };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [rx, ry],
  );

  const onMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    if (!g) return;
    setRy(g.ry + (e.clientX - g.x) * 0.4);
    setRx(Math.max(-70, Math.min(10, g.rx - (e.clientY - g.y) * 0.3)));
  }, []);

  const onUp = useCallback(() => {
    drag.current = null;
  }, []);

  const theme = {
    "--gb-accent": colors.accent,
    "--gb-deep": colors.deep,
    "--gb-hl": colors.hl,
    "--gb-strong": colors.strong,
    "--gb-deepink": colors.deepink,
    "--gb-bg-hi": colors.bgHi,
    "--gb-bg-lo": colors.bgLo,
  } as CSSProperties;

  return (
    <section className="home-hero" style={theme} aria-label="Glint">
      <header className="home-hero-nav">
        <SiteLinks />
      </header>

      <div className="home-hero-copy">
        <p className="home-hero-brand">Glint</p>
        <h1 className="home-hero-title">A band with no screen.</h1>
        <p className="home-hero-lede">
          You wear it. Heart rate, sleep, and movement stay on the phone until
          you decide a copy should leave.
        </p>
        <div className="hero-actions">
          <Link className="gl-btn gl-btn-primary" href="/pricing">
            [ Get the band ]
          </Link>
          <p className="price-note">{priceNote}</p>
        </div>
        <BandPicker />
      </div>

      <div
        className="home-hero-stage"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-label="Packaging box, drag to turn"
      >
        <div className="home-hero-box">
          <Sparkle className="gb-float gb-float-1" size={44} fill="var(--gb-strong)" />
          <Sparkle className="gb-float gb-float-2" size={26} fill="#fffaf2" />
          <Sparkle className="gb-float gb-float-3" size={20} fill="var(--gb-strong)" />
          <SlideBox b={metrics} wayName={BAND_LABEL[band]} rx={rx} ry={ry} />
        </div>
      </div>

      {isDev ? (
        <PackagingDev
          slide={slide}
          pat={pat}
          mm={mm}
          accent={colors.accent}
          onSlide={setSlide}
          onPat={setPat}
          onMm={setMm}
        />
      ) : null}
    </section>
  );
}

function Sparkle({
  className,
  size,
  fill,
}: {
  className: string;
  size: number;
  fill: string;
}) {
  return (
    <div className={className} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path d={MARK_PATH} style={{ fill }} />
      </svg>
    </div>
  );
}
