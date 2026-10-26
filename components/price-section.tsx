import Link from "next/link";
import { BuyForm } from "@/components/buy-form";
import { formatUsd } from "@/lib/money";
import type { DisplayPrices } from "@/lib/prices";

export function PriceSection({ prices }: { prices: DisplayPrices }) {
  return (
    <section className="section" id="band" aria-labelledby="prices">
      <h2 id="prices" className="h2">
        What you pay
      </h2>
      <div className="price-grid">
        <article className="gl-win gl-win-accent">
          <div className="gl-win-bar">
            <span className="gl-win-title">The band</span>
          </div>
          <div className="gl-win-body">
            <p className="gl-stat-value" style={{ margin: 0 }}>
              {formatUsd(prices.bandCents)}
              <span className="gl-stat-unit">usd</span>
            </p>
            <p>Once. The band works with no subscription.</p>
            <BuyForm
              enabled={prices.checkoutEnabled}
              backupCents={prices.backupCents}
            />
          </div>
        </article>
        <article className="gl-win">
          <div className="gl-win-bar">
            <span className="gl-win-title">Backup</span>
          </div>
          <div className="gl-win-body">
            <p className="gl-stat-value" style={{ margin: 0 }}>
              {formatUsd(prices.backupCents)}
              <span className="gl-stat-unit">usd / year</span>
            </p>
            <p>
              Optional. You choose what leaves the phone. Cancel backup and the
              band still works. <Link href="/privacy">How that choice works.</Link>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
