import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompetitorTable } from "@/components/competitor-table";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { copy, fill } from "@/content";
import { site } from "@/content/site";
import { competitorBySlug, competitors } from "@/lib/competitors";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return competitors.map((competitor) => ({ slug: competitor.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const competitor = competitorBySlug(slug);
  if (!competitor) return {};
  const filled = { competitor: competitor.name };
  return {
    title: `${fill(copy.compare.cardTitle, filled)} · ${site.name}`,
    description: fill(competitor.intro, filled),
  };
}

export default async function CompetitorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const competitor = competitorBySlug(slug);
  if (!competitor) notFound();
  const filled = { competitor: competitor.name };

  return (
    <div className="site">
      <SiteHeader />
      <article className="prose compare-page">
        <h1 className="h1">{fill(copy.compare.cardTitle, filled)}</h1>
        <p>{fill(competitor.intro, filled)}</p>
        <CompetitorTable competitor={competitor} />
        <p>
          <Link href="/pricing">{fill(copy.compare.pricingLink)}</Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
