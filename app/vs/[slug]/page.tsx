import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompetitorTable } from "@/components/competitor-table";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { competitorBySlug, competitors } from "@/lib/competitors";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return competitors.map((competitor) => ({ slug: competitor.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const competitor = competitorBySlug(slug);
  if (!competitor) return {};
  return {
    title: `Glint vs ${competitor.name} · Glint`,
    description: competitor.intro,
  };
}

export default async function CompetitorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const competitor = competitorBySlug(slug);
  if (!competitor) notFound();

  return (
    <div className="site">
      <SiteHeader />
      <article className="prose compare-page">
        <h1 className="h1">Glint vs {competitor.name}</h1>
        <p>{competitor.intro}</p>
        <CompetitorTable competitor={competitor} />
        <p>
          <Link href="/pricing">Glint pricing.</Link>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
