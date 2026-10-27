import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardIntro } from "@/components/dashboard-intro";
import { DashboardPanel } from "@/components/dashboard-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WarpCheck } from "@/components/warp-check";
import { copy, fill, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.dashboard.title),
  description: fill(copy.dashboard.description),
};

export default function DashboardPage() {
  const backupPaymentUrl = process.env.NEXT_PUBLIC_STRIPE_LINK_BACKUP?.trim() || null;
  const bandServiceId = process.env.NEXT_PUBLIC_BAND_SERVICE_ID?.trim() || null;

  return (
    <div className="site site-account">
      <SiteHeader />
      <main className="account-stage">
        <div className="account-stage-field" aria-hidden>
          <WarpCheck cols={36} rows={28} cell={48} seed={41} />
        </div>
        <div className="account-panel-shell gl-win">
          <DashboardIntro />
          <Suspense fallback={null}>
            <DashboardPanel backupPaymentUrl={backupPaymentUrl} bandServiceId={bandServiceId} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
