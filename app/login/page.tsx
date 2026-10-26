import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, fill, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.login.title),
  description: fill(copy.login.description),
};

export default function LoginPage() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">{copy.login.title}</h1>
        <p>{copy.login.body}</p>
        <p>
          <Link href="/pricing">{copy.login.pricing}</Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
