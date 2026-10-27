import { BuyForm } from "@/components/buy-form";
import { RichCopy } from "@/components/rich-copy";
import { copy, priceVars } from "@/content";
import { formatUsd } from "@/lib/money";
import type { DisplayPrices } from "@/lib/prices";

export function PriceSection({ prices }: { prices: DisplayPrices }) {
  const vars = priceVars(prices);

  return (
    <section className="section" id="band" aria-labelledby="prices">
      <h2 id="prices" className="h2">
        {copy.pricing.heading}
      </h2>
      <div className="price-grid">
        <article className="gl-win gl-win-accent">
          <div className="gl-win-bar">
            <span className="gl-win-title">{copy.pricing.band}</span>
          </div>
          <div className="gl-win-body">
            <p className="gl-stat-value" style={{ margin: 0 }}>
              {formatUsd(prices.bandCents)}
              <span className="gl-stat-unit">{copy.pricing.unit}</span>
            </p>
            <p>{copy.pricing.bandBody}</p>
            <BuyForm
              enabled={prices.checkoutEnabled}
              backupCents={prices.backupCents}
              bandPaymentUrl={prices.bandPaymentUrl}
              backupPaymentUrl={prices.backupPaymentUrl}
            />
          </div>
        </article>
        <article className="gl-win">
          <div className="gl-win-bar">
            <span className="gl-win-title">{copy.pricing.backup}</span>
          </div>
          <div className="gl-win-body">
            <p className="gl-stat-value" style={{ margin: 0 }}>
              {formatUsd(prices.backupCents)}
              <span className="gl-stat-unit">{copy.pricing.backupUnit}</span>
            </p>
            <p>
              <RichCopy parts={copy.pricing.backupBody} vars={vars} />
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
