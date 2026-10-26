import { ComparePicker } from "@/components/compare-picker";
import { WarpCheck } from "@/components/warp-check";
import { copy, fill, priceVars } from "@/content";
import type { DisplayPrices } from "@/lib/prices";
import { fallbackPrices } from "@/lib/prices";

export function CompareSection({
  prices = fallbackPrices,
}: {
  prices?: Pick<DisplayPrices, "bandCents" | "backupCents">;
}) {
  const vars = priceVars(prices);

  return (
    <section className="section" aria-labelledby="compare">
      <div className="compare-band">
        <div className="compare-band-field" aria-hidden>
          <WarpCheck cols={28} rows={24} cell={48} seed={19} />
        </div>
        <div className="compare-band-copy">
          <h2 id="compare" className="h2">
            {fill(copy.compare.heading, vars)}
          </h2>
          <p className="section-lede">{fill(copy.compare.lede, vars)}</p>
        </div>
        <ComparePicker vars={vars} />
      </div>
    </section>
  );
}
