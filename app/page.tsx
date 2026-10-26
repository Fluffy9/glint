import { Suspense } from "react";
import { CompareSection } from "@/components/compare-section";
import { HomeHero } from "@/components/home-hero";
import { PriceSection } from "@/components/price-section";
import { ProgressSample } from "@/components/progress-sample";
import { SiteFooter } from "@/components/site-footer";
import { formatUsd } from "@/lib/money";
import { fallbackPrices, getDisplayPrices, type DisplayPrices } from "@/lib/prices";

const promises = [
  {
    title: "No screen",
    body: "Nothing on your wrist to check in the middle of a run. The band keeps the record. You look when you want to.",
  },
  {
    title: "No monthly fee",
    body: "The band is $69.99 once. It keeps working if you never pay again. Backup is a separate $10 a year, and you can skip it.",
  },
  {
    title: "No feed",
    body: "A slower week is information. There is no scoreboard and no one to perform for.",
  },
];

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
        <CompareSection />

        <section className="section" aria-labelledby="promises">
          <h2 id="promises" className="h2">
            The offer
          </h2>
          <div className="promise-grid">
            {promises.map((promise) => (
              <article key={promise.title} className="gl-win">
                <div className="gl-win-bar">
                  <span className="gl-win-title">{promise.title}</span>
                </div>
                <div className="gl-win-body">
                  <p style={{ margin: 0 }}>{promise.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="sample">
          <h2 id="sample" className="h2">
            One glance
          </h2>
          <div className="gl-win">
            <div className="gl-win-bar">
              <span className="gl-win-title">Today, a sample</span>
            </div>
            <div className="gl-win-body preview">
              <ProgressSample />
              <div className="stat-grid">
                <div className="gl-stat">
                  <span className="gl-stat-label">Heart rate</span>
                  <span className="gl-stat-value">
                    58<span className="gl-stat-unit">bpm</span>
                  </span>
                  <span className="gl-stat-delta is-down">3 lower than last week</span>
                </div>
                <div className="gl-stat">
                  <span className="gl-stat-label">Sleep</span>
                  <span className="gl-stat-value">
                    7.4<span className="gl-stat-unit">h</span>
                  </span>
                </div>
                <div className="gl-stat">
                  <span className="gl-stat-label">Steps</span>
                  <span className="gl-stat-value">8420</span>
                </div>
              </div>
            </div>
          </div>
          <p className="fine">
            These figures are a picture of the app, not your data. The page
            accent follows the band colour. Light and dark are the control in the
            header.
          </p>
        </section>

        <PriceSection prices={prices} />
        <SiteFooter />
      </div>
    </>
  );
}
