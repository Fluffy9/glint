import type { Metadata } from "next";
import { ProseBlocks } from "@/components/rich-copy";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, fill, pageTitle } from "@/content";
import { securityContact } from "@/lib/site";

export const metadata: Metadata = {
  title: pageTitle(copy.security.title),
  description: fill(copy.security.description),
};

export default function SecurityPage() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">{copy.security.title}</h1>
        <ProseBlocks blocks={copy.security.blocks} />
        {securityContact ? (
          <p>
            Report a vulnerability to <a href={`mailto:${securityContact}`}>{securityContact}</a>.
          </p>
        ) : null}
      </article>
      <SiteFooter />
    </div>
  );
}
