import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { securityContact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security · Glint",
  description: "How Glint protects payments, and what changes when health data is stored.",
};

export default function SecurityPage() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">Security</h1>
        <h2>Payments</h2>
        <p>
          Card numbers stay at Stripe. Checkout is Stripe&apos;s page. Glint
          stores the order email, whether you bought the band and backup, and
          the subscription status.
        </p>
        <h2>This website</h2>
        <p>
          The production site is served over HTTPS. This website does not
          collect health data, and it does not load third-party ads or
          analytics. Glint does not sell customer data.
        </p>
        <h2>When you store health data with Glint</h2>
        <p>
          Locked backup is encrypted on your phone before it is uploaded. We
          cannot read that copy, and a database backup does not reveal it.
        </p>
        <p>
          Data you put in your account is a different copy. Glint can read it,
          which is how charts load when you sign in. It is stored under your
          login, and the database host encrypts the disks. People who administer
          the database can read this copy too.
        </p>
        <p>
          You will be able to delete the account, and Glint will delete the
          copies it holds. That action is not on this website yet.
        </p>
        <p>
          The choice between those copies is described on{" "}
          <Link href="/privacy">Privacy</Link>.
        </p>
        {securityContact ? (
          <p>
            Report a vulnerability to{" "}
            <a href={`mailto:${securityContact}`}>{securityContact}</a>.
          </p>
        ) : null}
      </article>
      <SiteFooter />
    </div>
  );
}
