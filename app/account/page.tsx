import type { Metadata } from "next";
import { AccountPanel } from "@/components/account-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, fill, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.account.title),
  description: fill(copy.account.description),
};

export default function AccountPage() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">{copy.account.title}</h1>
        <p>{copy.account.description}</p>
        <AccountPanel />
      </article>
      <SiteFooter />
    </div>
  );
}
