import { Suspense } from "react";
import { CompareSection } from "@/components/compare-section";
import { FaqSection } from "@/components/faq-section";
import { FeaturesSection } from "@/components/features-section";
import { HomeHero } from "@/components/home-hero";
import { SiteFooter } from "@/components/site-footer";
import { copy, fill, priceVars } from "@/content";
import { closedCheckout, fallbackPrices, getDisplayPrices, type DisplayPrices } from "@/lib/prices";

const disabledPrices: DisplayPrices = { ...fallbackPrices, ...closedCheckout };

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
      <HomeHero priceNote={fill(copy.hero.priceNote, priceVars(prices))} />

      <div className="site">
        <FeaturesSection />
        <CompareSection prices={prices} />
        <FaqSection prices={prices} />
        <SiteFooter />
      </div>
    </>
  );
}
