"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppearance } from "@/components/appearance-provider";
import { boxPaint, useBandWipe, washStyle } from "@/components/band-wipe";
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

type Props = {
  priceNote: string;
};

export function HomeHero({ priceNote }: Props) {
  const { band, mode, setBand } = useAppearance();
  const { wipe, paintBand, chooseBand, finishWipe } = useBandWipe(band, setBand);
  const { rx, ry, onPointerDown, onPointerMove, onPointerUp } = useBoxDrag();
  const [slide, setSlide] = useState(0);
  const [pat, setPat] = useState<PatternId>("warpSpark");
  const [mm, setMm] = useState<BoxMm>([110, 110, 60]);
  const [devOpen, setDevOpen] = useState(false);

  const metrics = useMemo(
    () => boxMetrics({ mm, pat, slide, id: "hero" }),
    [mm, pat, slide],
  );

  return (
    <section className="home-hero" style={boxPaint(paintBand)} aria-label={site.name}>
      <div className="home-hero-wash" style={washStyle(wipe?.from ?? band, mode)} aria-hidden />
      {wipe ? (
        <div
          key={`${wipe.from}-${wipe.to}`}
          className="home-hero-wash is-incoming"
          style={washStyle(wipe.to, mode)}
          onAnimationEnd={finishWipe}
          aria-hidden
        />
      ) : null}

      <header className="home-hero-nav">
        <SiteLinks />
      </header>

      <div className="home-hero-copy">
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
