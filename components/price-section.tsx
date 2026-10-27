import { BandPicker } from "@/components/band-picker";
import { BuyForm } from "@/components/buy-form";
import { ProductShot } from "@/components/product-shot";
import { copy, fill, priceVars } from "@/content";
import { formatUsdLabel } from "@/lib/money";
import type { DisplayPrices } from "@/lib/prices";
import { site } from "@/content/site";

export function PriceSection({ prices }: { prices: DisplayPrices }) {
  const vars = priceVars(prices);
  const bandPrice = formatUsdLabel(prices.bandCents);
  const backupPrice = formatUsdLabel(prices.backupCents);

  return (
    <section className="product" aria-labelledby="product-title">
      <ProductShot />
      <div className="product-info">
        <p className="product-kicker">{copy.pricing.kicker}</p>
        <div className="product-title-row">
          <h1 id="product-title" className="product-title">
            {fill(copy.pricing.product, { name: site.name })}
          </h1>
          <p className="product-price">
            {bandPrice}
            <span>{copy.pricing.once}</span>
          </p>
        </div>
        <p className="product-lede">{fill(copy.pricing.lede, vars)}</p>
        <div className="product-band">
          <BandPicker />
        </div>

        <ul className="product-offers">
          <li>
            <div>
              <p className="product-offer-name">{copy.pricing.dashboard}</p>
              <p className="product-offer-body">{copy.pricing.dashboardBody}</p>
            </div>
            <p className="product-offer-price">{copy.pricing.free}</p>
          </li>
          <li className="is-hardware">
            <div>
              <p className="product-offer-name">{copy.pricing.band}</p>
              <p className="product-offer-body">{copy.pricing.bandBody}</p>
            </div>
            <p className="product-offer-price">
              {bandPrice}
              <span>{copy.pricing.once}</span>
            </p>
          </li>
          <li>
            <div>
              <p className="product-offer-name">
                {copy.pricing.backup}{" "}
                <span className="product-offer-tag">{copy.pricing.optional}</span>
              </p>
              <p className="product-offer-body">{copy.pricing.backupBody}</p>
            </div>
            <p className="product-offer-price">
              {backupPrice}
              <span>{copy.pricing.backupUnit}</span>
            </p>
          </li>
        </ul>

        <BuyForm
          enabled={prices.checkoutEnabled}
          backupCents={prices.backupCents}
          bandPaymentUrl={prices.bandPaymentUrl}
          backupPaymentUrl={prices.backupPaymentUrl}
        />
      </div>
    </section>
  );
}
