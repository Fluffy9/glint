import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { securityContact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security · Glint",
  description: "How Glint protects payments, and how encrypted backup works.",
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
          The production site is served over HTTPS. This website does not load
          third-party ads or analytics. Glint does not sell customer data.
        </p>
        <h2>When you store health data with Glint</h2>
        <p>
          Backup is encrypted on your phone before it is uploaded. We store
          ciphertext only. A database backup does not reveal readable samples.
        </p>
        <p>
          The website decrypts with your password so charts can load while you
          are signed in. Resetting the password does not unlock old ciphertext.
          Keep the copy on your phone, or export a plain file, if you want a way
          back without that password.
        </p>
        <p>
          You will be able to delete the account, and Glint will delete the
          copies it holds. That action is not on this website yet.
        </p>
        <p>
          The same rules are written in plain language on{" "}
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
