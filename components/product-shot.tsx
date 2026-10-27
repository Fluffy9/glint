"use client";

import { useMemo } from "react";
import { useAppearance } from "@/components/appearance-provider";
import { boxPaint } from "@/components/band-wipe";
import { SlideBox } from "@/components/glint-box/slide-box";
import { useBoxDrag } from "@/components/use-box-drag";
import { copy } from "@/content";
import { BAND_LABEL, boxMetrics } from "@/lib/glint-box/metrics";

const placeholders = [0, 1, 2];

export function ProductShot() {
  const { band } = useAppearance();
  const { rx, ry, onPointerDown, onPointerMove, onPointerUp } = useBoxDrag();
  const metrics = useMemo(
    () => boxMetrics({ mm: [110, 110, 60], pat: "warpSpark", slide: 0, id: "price" }),
    [],
  );

  return (
    <div className="product-gallery">
      <div
        className="product-stage"
        style={boxPaint(band)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label={copy.nav.dragToTurn}
      >
        <div className="product-stage-box">
          <SlideBox b={metrics} wayName={BAND_LABEL[band]} rx={rx} ry={ry} />
        </div>
      </div>
      <div className="product-thumbs" role="list" aria-label={copy.pricing.gallery}>
        <div className="product-thumb is-selected" role="listitem">
          <span>{copy.pricing.viewBox}</span>
        </div>
        {placeholders.map((id) => (
          <div key={id} className="product-thumb is-placeholder" role="listitem">
            <span>{copy.pricing.viewSoon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
