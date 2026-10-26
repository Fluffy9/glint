import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ManageBilling } from "@/components/manage-billing";
import { copy, fill, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.checkout.successTitle),
};

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">{copy.checkout.successTitle}</h1>
        <p>{copy.checkout.successBody}</p>
        {sessionId ? <ManageBilling sessionId={sessionId} /> : null}
        <p>
          <Link href="/">{fill(copy.checkout.back)}</Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
