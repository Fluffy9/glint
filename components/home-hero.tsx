"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppearance } from "@/components/appearance-provider";
import { boxPaint, useBandWipe, washStyle } from "@/components/band-wipe";
import { HalftoneWipe } from "@/components/halftone-wipe";
import { BandPicker } from "@/components/band-picker";
import { PackagingDev } from "@/components/glint-box/packaging-dev";
import { SlideBox } from "@/components/glint-box/slide-box";
import { SiteLinks } from "@/components/site-links";
import { useBoxDrag } from "@/components/use-box-drag";
import { copy } from "@/content";
import { site } from "@/content/site";
import { BAND_LABEL, boxMetrics, type BoxMm } from "@/lib/glint-box/metrics";
import { MARK_PATH, type PatternId } from "@/lib/glint-box/patterns";

const isDev = process.env.NODE_ENV === "development";
/** How much of the headline column the box may cover before it drops underneath. */
const OVERLAP_LIMIT = 0.5;

type Props = {
  priceNote: string;
};

export function HomeHero({ priceNote }: Props) {
  const { band, mode, setBand } = useAppearance();
  const { wipe, covered, paintBand, chooseBand, coverWipe, finishWipe } = useBandWipe(band, setBand);
  const { rx, ry, onPointerDown, onPointerMove, onPointerUp } = useBoxDrag();
  const [slide, setSlide] = useState(0);
  const [pat, setPat] = useState<PatternId>("warpSpark");
  const [mm, setMm] = useState<BoxMm>([110, 110, 60]);
  const [devOpen, setDevOpen] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [stacked, setStacked] = useState(false);
  const stackedAt = useRef(0);

  const metrics = useMemo(
    () => boxMetrics({ mm, pat, slide, id: "hero" }),
    [mm, pat, slide],
  );

  useEffect(() => {
    const layout = layoutRef.current;
    const copy = copyRef.current;
    const box = boxRef.current;
    if (!layout || !copy || !box) return;

    const measure = () => {
      const layoutBox = layout.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      const product = paintedBounds(box);
      if (product.width < 8) return;
      const stackedNow = layout.classList.contains("is-stacked");
      if (stackedNow) {
        const origin = box.getBoundingClientRect();
        const stage = box.parentElement?.getBoundingClientRect();
        layout.style.setProperty("--hero-product-h", `${Math.ceil(product.height + 8)}px`);
        layout.style.setProperty("--hero-product-top", `${Math.ceil(origin.top - product.top + 4)}px`);
        if (stage) {
          const centerOffset = product.left + product.width / 2 - origin.left;
          layout.style.setProperty("--hero-product-x", `${Math.round(-centerOffset)}px`);
        }
        if (layoutBox.width >= stackedAt.current + 48) setStacked(false);
        return;
      }
      const overlap = copyBox.right - product.left;
      if (overlap > copyBox.width * OVERLAP_LIMIT) {
        stackedAt.current = layoutBox.width;
        setStacked(true);
      }
    };

    const observer = new ResizeObserver(() => measure());
    observer.observe(layout);
    measure();
    return () => observer.disconnect();
  }, [stacked, mm, pat, slide]);

  return (
    <section className="home-hero" style={boxPaint(paintBand)} aria-label={site.name}>
      <div
        className="home-hero-wash"
        style={washStyle(wipe && covered ? wipe.to : (wipe?.from ?? band), mode)}
        aria-hidden
      />
      {wipe ? (
        <HalftoneWipe
          key={`${wipe.from}-${wipe.to}`}
          band={wipe.to}
          mode={mode}
          onCovered={coverWipe}
          onDone={finishWipe}
        />
      ) : null}

      <header className="home-hero-nav">
        <SiteLinks />
      </header>

      <div ref={layoutRef} className={stacked ? "home-hero-layout is-stacked" : "home-hero-layout"}>
        <div ref={copyRef} className="home-hero-copy">
          <p className="home-hero-brand">{site.name}</p>
          <h1 className="home-hero-title">{copy.hero.title}</h1>
          <p className="home-hero-lede">{copy.hero.lede}</p>
          <BandPicker onSelect={chooseBand} busy={wipe !== null} />
          <div className="hero-actions">
            <Link className="gl-btn gl-btn-primary" href="/pricing">
              {copy.nav.getTheBand}
            </Link>
            <p className="price-note">{priceNote}</p>
          </div>
        </div>

        <div
          className="home-hero-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label={copy.nav.dragToTurn}
        >
          <div ref={boxRef} className="home-hero-box">
            <Sparkle className="gb-float gb-float-1" size={44} fill="var(--gb-strong)" />
            <Sparkle className="gb-float gb-float-2" size={26} fill="#fffaf2" />
            <Sparkle className="gb-float gb-float-3" size={20} fill="var(--gb-strong)" />
            <SlideBox b={metrics} wayName={BAND_LABEL[band]} rx={rx} ry={ry} />
          </div>
        </div>
      </div>

      {isDev ? (
        <button
          type="button"
          className="home-hero-dev-toggle"
          data-dev-chrome
          aria-pressed={devOpen}
          onClick={() => setDevOpen((open) => !open)}
        >
          Dev
        </button>
      ) : null}
      {isDev && devOpen ? (
        <div data-dev-chrome>
          <PackagingDev
            slide={slide}
            pat={pat}
            mm={mm}
            onSlide={setSlide}
            onPat={setPat}
            onMm={setMm}
          />
        </div>
      ) : null}
    </section>
  );
}

function paintedBounds(root: HTMLElement) {
  const nodes = root.querySelectorAll(".gb-face");
  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.width < 1 && rect.height < 1) return;
    left = Math.min(left, rect.left);
    right = Math.max(right, rect.right);
    top = Math.min(top, rect.top);
    bottom = Math.max(bottom, rect.bottom);
  });
  return { left, right, top, bottom, width: right - left, height: bottom - top };
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
