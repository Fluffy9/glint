import { Suspense } from "react";
import { CompareSection } from "@/components/compare-section";
import { FaqSection } from "@/components/faq-section";
import { FeaturesSection } from "@/components/features-section";
import { HomeHero } from "@/components/home-hero";
import { SiteFooter } from "@/components/site-footer";
import { formatUsd } from "@/lib/money";
import { fallbackPrices, getDisplayPrices, type DisplayPrices } from "@/lib/prices";

const disabledPrices: DisplayPrices = { ...fallbackPrices, checkoutEnabled: false };

export default function Home() {
  return (
    <Suspense fallback={<HomeBody prices={disabledPrices} />}>
      <HomeWithPrices />
    </Suspense>
  );
}

async function HomeWithPrices() {
  return <HomeBody prices={await getDisplayPrices()} />;
}

function HomeBody({ prices }: { prices: DisplayPrices }) {
  return (
    <>
      <HomeHero priceNote={`${formatUsd(prices.bandCents)} usd once`} />

      <div className="site">
        <FeaturesSection />
        <CompareSection />
        <FaqSection />
        <SiteFooter />
      </div>
    </>
  );
}
