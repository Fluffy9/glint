import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ManageBilling } from "@/components/manage-billing";

export const metadata: Metadata = {
  title: "Order received · Glint",
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
        <h1 className="h1">Order received</h1>
        <p>
          Stripe has the payment. The band works without backup. If you added
          backup, you can cancel it and the band still works.
        </p>
        {sessionId ? <ManageBilling sessionId={sessionId} /> : null}
        <p>
          <Link href="/">Back to Glint</Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
