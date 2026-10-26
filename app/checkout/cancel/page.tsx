import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.checkout.cancelTitle),
};

export default function CheckoutCancel() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">{copy.checkout.cancelTitle}</h1>
        <p>{copy.checkout.cancelBody}</p>
        <p>
          <Link className="gl-btn gl-btn-primary" href="/#band">
            {copy.nav.getTheBand}
          </Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
