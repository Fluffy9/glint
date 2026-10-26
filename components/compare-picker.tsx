"use client";

import { useState } from "react";
import { CompetitorTable } from "@/components/competitor-table";
import { competitors } from "@/lib/competitors";

export function ComparePicker() {
  const [slug, setSlug] = useState(competitors[0].slug);

  return (
    <div className="compare-picker">
      <div className="gl-tabs compare-tabs" role="tablist" aria-label="Competitors">
        {competitors.map((competitor) => {
          const selected = competitor.slug === slug;
          return (
            <button
              key={competitor.slug}
              type="button"
              className="gl-tab"
              role="tab"
              id={`compare-tab-${competitor.slug}`}
              aria-selected={selected}
              aria-controls={`compare-panel-${competitor.slug}`}
              onClick={() => setSlug(competitor.slug)}
            >
              {competitor.name}
            </button>
          );
        })}
      </div>
      <div className="compare-panels">
        {competitors.map((competitor) => {
          const selected = competitor.slug === slug;
          return (
            <div
              key={competitor.slug}
              id={`compare-panel-${competitor.slug}`}
              className={selected ? undefined : "compare-panel-idle"}
              role="tabpanel"
              aria-labelledby={`compare-tab-${competitor.slug}`}
              aria-hidden={!selected}
              inert={!selected ? true : undefined}
            >
              <CompetitorTable competitor={competitor} heading="h3" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
