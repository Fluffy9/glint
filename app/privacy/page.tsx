import type { Metadata } from "next";
import { ProseBlocks } from "@/components/rich-copy";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, fill, pageTitle } from "@/content";

export const metadata: Metadata = {
  title: pageTitle(copy.privacy.title),
  description: fill(copy.privacy.description),
};

export default function PrivacyPage() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">{copy.privacy.title}</h1>
        <ProseBlocks blocks={copy.privacy.blocks} />
      </article>
      <SiteFooter />
    </div>
  );
}
