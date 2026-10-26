import { ComparePicker } from "@/components/compare-picker";
import { WarpCheck } from "@/components/warp-check";

export function CompareSection() {
  return (
    <section className="section" aria-labelledby="compare">
      <div className="compare-band">
        <div className="compare-band-field" aria-hidden>
          <WarpCheck cols={28} rows={24} cell={48} seed={19} />
        </div>
        <div className="compare-band-copy">
          <h2 id="compare" className="h2">
            Glint vs the usual stack
          </h2>
          <p className="section-lede">
            Whoop bills by the year. Fitbit Air, Helio Strap, and Polar Loop sell the band once. Glint is $69.99 once.
          </p>
        </div>
        <ComparePicker />
      </div>
    </section>
  );
}
