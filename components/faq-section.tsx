import { RichCopy } from "@/components/rich-copy";
import { copy, fill, priceVars } from "@/content";
import type { DisplayPrices } from "@/lib/prices";
import { fallbackPrices } from "@/lib/prices";

export function FaqSection({
  prices = fallbackPrices,
}: {
  prices?: Pick<DisplayPrices, "bandCents" | "backupCents">;
}) {
  const vars = priceVars(prices);

  return (
    <section className="section" aria-labelledby="faq">
      <h2 id="faq" className="h2">
        {copy.faq.heading}
      </h2>
      <p className="section-lede">{copy.faq.lede}</p>

      <div className="faq-list">
        {copy.faq.items.map((item) => (
          <details key={item.question} className="faq-item">
            <summary className="faq-question">{fill(item.question, vars)}</summary>
            <div className="faq-answer">
              <RichCopy parts={item.answer} vars={vars} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
