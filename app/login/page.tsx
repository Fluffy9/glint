import type { Metadata } from "next";
import { AccountIntro } from "@/components/account/intro";
import { AccountPanel } from "@/components/account-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WarpCheck } from "@/components/warp-check";
import { copy, fill, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.login.title),
  description: fill(copy.login.description),
};

export default function LoginPage() {
  return (
    <div className="site site-account">
      <SiteHeader />
      <main className="account-stage">
        <div className="account-stage-field" aria-hidden>
          <WarpCheck cols={36} rows={28} cell={48} seed={41} />
        </div>
        <div className="account-panel-shell gl-win">
          <AccountIntro />
          <AccountPanel />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
