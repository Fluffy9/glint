"use client";

import Link from "next/link";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { BandPicker } from "@/components/band-picker";
import { PackagingDev } from "@/components/glint-box/packaging-dev";
import { SlideBox } from "@/components/glint-box/slide-box";
import { SiteLinks } from "@/components/site-links";
import { useAppearance } from "@/components/appearance-provider";
import type { BandColor } from "@/lib/appearance";
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

type Wipe = { from: BandColor; to: BandColor };

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function washStyle(band: BandColor): CSSProperties {
  const colors = colorwayVars(BAND_HUE[band]);
  return {
    "--wash-hi": colors.bgHi,
    "--wash-lo": colors.bgLo,
  } as CSSProperties;
}

function boxPaint(band: BandColor): CSSProperties {
  const colors = colorwayVars(BAND_HUE[band]);
  return {
    "--gb-accent": colors.accent,
    "--gb-deep": colors.deep,
    "--gb-hl": colors.hl,
    "--gb-strong": colors.strong,
    "--gb-deepink": colors.deepink,
  } as CSSProperties;
}

export function HomeHero({ priceNote }: Props) {
  const { band, setBand } = useAppearance();
  const [wipe, setWipe] = useState<Wipe | null>(null);
  const wipeRef = useRef<Wipe | null>(null);
  const pendingRef = useRef<BandColor | null>(null);
  const bandRef = useRef(band);
  bandRef.current = band;
  wipeRef.current = wipe;

  const paintBand = wipe?.to ?? band;
  const colors = colorwayVars(BAND_HUE[paintBand]);

  const [rx, setRx] = useState(-24);
  const [ry, setRy] = useState(-36);
  const [slide, setSlide] = useState(0);
  const [pat, setPat] = useState<PatternId>("warpSpark");
  const [mm, setMm] = useState<BoxMm>([110, 110, 60]);
  const [devOpen, setDevOpen] = useState(false);
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

  return (
    <section className="home-hero" style={boxPaint(paintBand)} aria-label="Glint">
      <div className="home-hero-wash" style={washStyle(wipe?.from ?? band)} aria-hidden />
      {wipe ? (
        <div
          key={`${wipe.from}-${wipe.to}`}
          className="home-hero-wash is-incoming"
          style={washStyle(wipe.to)}
          onAnimationEnd={finishWipe}
          aria-hidden
        />
      ) : null}

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
        <BandPicker onSelect={chooseBand} busy={wipe !== null} />
        <div className="hero-actions">
          <Link className="gl-btn gl-btn-primary" href="/pricing">
            [ Get the band ]
          </Link>
          <p className="price-note">{priceNote}</p>
        </div>
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
        <button
          type="button"
          className="home-hero-dev-toggle"
          aria-pressed={devOpen}
          onClick={() => setDevOpen((open) => !open)}
        >
          Dev
        </button>
      ) : null}
      {isDev && devOpen ? (
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
