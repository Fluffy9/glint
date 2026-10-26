import type { Metadata } from "next";
import { Suspense } from "react";
import { PriceSection } from "@/components/price-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, fill, pageTitle } from "@/content";
import { fallbackPrices, getDisplayPrices, type DisplayPrices } from "@/lib/prices";

export const metadata: Metadata = {
  title: pageTitle(copy.pricing.title),
  description: fill(copy.pricing.description),
};

const disabledPrices: DisplayPrices = { ...fallbackPrices, checkoutEnabled: false };

export default function PricingPage() {
  return (
    <div className="site">
      <SiteHeader />
      <Suspense fallback={<PriceSection prices={disabledPrices} />}>
        <PricingPrices />
      </Suspense>
      <SiteFooter />
    </div>
  );
}

async function PricingPrices() {
  return <PriceSection prices={await getDisplayPrices()} />;
}
