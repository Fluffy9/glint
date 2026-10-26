import { copy } from "@/content";

export type CompareRow = {
  label: string;
  glint: string;
  theirs: string;
  /** Which cell to emphasize. Even leaves both in body weight. */
  lean: "glint" | "even";
};

export type CompetitorSource = {
  label: string;
  href: string;
};

export type Competitor = {
  slug: string;
  name: string;
  /** Search-facing first paragraph. Prices are US list prices as of October 2026. */
  intro: string;
  rows: CompareRow[];
  /** Short note under the links. */
  checked: string;
  sources: CompetitorSource[];
};

function expandGlint(value: string): string {
  return value
    .replaceAll("{keep}", copy.compare.glintKeep)
    .replaceAll("{screen}", copy.compare.glintScreen)
    .replaceAll("{battery}", copy.compare.glintBattery)
    .replaceAll("{record}", copy.compare.glintRecord);
}

export const competitors: Competitor[] = copy.competitors.map((competitor) => ({
  slug: competitor.slug,
  name: competitor.name,
  intro: competitor.intro,
  checked: competitor.checked,
  sources: competitor.sources.map((source) => ({ ...source })),
  rows: competitor.rows.map((row) => ({
    label: row.label,
    glint: expandGlint(row.glint),
    theirs: row.theirs,
    lean: row.lean,
  })),
}));

export function competitorBySlug(slug: string): Competitor | undefined {
  return competitors.find((competitor) => competitor.slug === slug);
}
