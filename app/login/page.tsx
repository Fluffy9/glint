import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Sign in · Glint",
  description: "Sign in to a Glint account.",
};

export default function LoginPage() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">Sign in</h1>
        <p>
          An account is where a backup lives after you choose to send a copy off
          the phone. Sign-in is not open on this site yet.
        </p>
        <p>
          <Link href="/pricing">See pricing</Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
