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
};

export async function getDisplayPrices(): Promise<DisplayPrices> {
  await connection();
  const bandPrice = process.env.STRIPE_PRICE_BAND;
  const backupPrice = process.env.STRIPE_PRICE_BACKUP;
  if (!process.env.STRIPE_SECRET_KEY || !bandPrice || !backupPrice) {
    return { ...fallbackPrices, checkoutEnabled: false };
  }

  try {
    const stripe = getStripe();
    const [band, backup] = await Promise.all([
      stripe.prices.retrieve(bandPrice),
      stripe.prices.retrieve(backupPrice),
    ]);
    return {
      bandCents: band.unit_amount ?? fallbackPrices.bandCents,
      backupCents: backup.unit_amount ?? fallbackPrices.backupCents,
      checkoutEnabled: true,
    };
  } catch {
    return { ...fallbackPrices, checkoutEnabled: false };
  }
}
