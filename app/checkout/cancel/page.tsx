import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Checkout canceled · Glint",
};

export default function CheckoutCancel() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">Checkout canceled</h1>
        <p>No charge was made.</p>
        <p>
          <Link className="gl-btn gl-btn-primary" href="/#band">
            [ Get the band ]
          </Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
