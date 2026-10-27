import { connection } from "next/server";
import { getStripe } from "./stripe";

export const fallbackPrices = {
  bandCents: 6999,
  backupCents: 1000,
};

export type DisplayPrices = {
  bandCents: number;
  backupCents: number;
  checkoutEnabled: boolean;
  bandPaymentUrl: string | null;
  backupPaymentUrl: string | null;
};

export const closedCheckout = {
  checkoutEnabled: false,
  bandPaymentUrl: null,
  backupPaymentUrl: null,
} as const;

export function paymentLinksFromEnv(env: Record<string, string | undefined>): Pick<
  DisplayPrices,
  "bandPaymentUrl" | "backupPaymentUrl" | "checkoutEnabled"
> {
  const bandPaymentUrl = env.NEXT_PUBLIC_STRIPE_LINK_BAND?.trim() || null;
  const backupPaymentUrl = env.NEXT_PUBLIC_STRIPE_LINK_BACKUP?.trim() || null;
  return {
    bandPaymentUrl,
    backupPaymentUrl,
    checkoutEnabled: Boolean(bandPaymentUrl && backupPaymentUrl),
  };
}

export async function getDisplayPrices(): Promise<DisplayPrices> {
  const links = paymentLinksFromEnv(process.env);
  const priced = { ...fallbackPrices, ...links };
  // GitHub Pages is a static export. There is no request and no Stripe call.
  if (process.env.GITHUB_PAGES === "1") return priced;
  await connection();
  const bandPrice = process.env.STRIPE_PRICE_BAND;
  const backupPrice = process.env.STRIPE_PRICE_BACKUP;
  if (!process.env.STRIPE_SECRET_KEY || !bandPrice || !backupPrice) return priced;

  try {
    const stripe = getStripe();
    const [band, backup] = await Promise.all([
      stripe.prices.retrieve(bandPrice),
      stripe.prices.retrieve(backupPrice),
    ]);
    return {
      ...priced,
      bandCents: band.unit_amount ?? fallbackPrices.bandCents,
      backupCents: backup.unit_amount ?? fallbackPrices.backupCents,
    };
  } catch {
    return priced;
  }
}
