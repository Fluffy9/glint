import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CheckoutSession } from "@/components/checkout-session";
import { copy, fill, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.checkout.successTitle),
};

export default function CheckoutSuccess() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">{copy.checkout.successTitle}</h1>
        <p>{copy.checkout.successBody}</p>
        <CheckoutSession />
        <p>
          <Link href="/">{fill(copy.checkout.back)}</Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
