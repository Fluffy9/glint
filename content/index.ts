import { fallbackPrices, type DisplayPrices } from "@/lib/prices";
import { formatUsd, formatUsdLabel } from "@/lib/money";
import { en } from "./en";
import { site } from "./site";

export const copy = en;

export type CopyVars = {
  name: string;
  amount: string;
  bandPrice: string;
  backupPrice: string;
  competitor?: string;
  mode?: string;
};

export function priceVars(prices: Pick<DisplayPrices, "bandCents" | "backupCents">): CopyVars {
  return {
    name: site.name,
    amount: formatUsd(prices.bandCents),
    bandPrice: formatUsdLabel(prices.bandCents),
    backupPrice: formatUsdLabel(prices.backupCents),
  };
}

export const fallbackCopyVars = priceVars(fallbackPrices);

export function fill(template: string, extra?: Partial<CopyVars>): string {
  const vars = { ...fallbackCopyVars, ...extra };
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key as keyof CopyVars];
    return value ?? match;
  });
}

export function pageTitle(label: string): string {
  return `${fill(label)} · ${site.name}`;
}
