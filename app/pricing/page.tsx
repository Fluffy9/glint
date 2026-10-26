import type { Metadata } from "next";
import { Suspense } from "react";
import { PriceSection } from "@/components/price-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fallbackPrices, getDisplayPrices, type DisplayPrices } from "@/lib/prices";

export const metadata: Metadata = {
  title: "Pricing · Glint",
  description: "The band is $69.99 once. Backup is $10 a year, and it is optional.",
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
