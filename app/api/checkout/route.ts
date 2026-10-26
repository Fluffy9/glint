import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { parseCheckoutSelection } from "@/lib/checkout-selection";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid checkout" }, { status: 400 });
  }

  const selection = parseCheckoutSelection(body);
  if (!selection) {
    return NextResponse.json({ error: "invalid checkout" }, { status: 400 });
  }

  const bandPrice = process.env.STRIPE_PRICE_BAND;
  const backupPrice = process.env.STRIPE_PRICE_BACKUP;
  if (!bandPrice || !backupPrice || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "checkout is not configured" }, { status: 503 });
  }

  const origin = siteUrl();
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: selection.backup ? "subscription" : "payment",
    line_items: [
      { price: bandPrice, quantity: 1 },
      ...(selection.backup ? [{ price: backupPrice, quantity: 1 }] : []),
    ],
    metadata: {
      band: "true",
      backup: selection.backup ? "true" : "false",
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,
  };
  if (!selection.backup) {
    params.customer_creation = "always";
  }
  const session = await getStripe().checkout.sessions.create(params);

  if (!session.url) {
    return NextResponse.json({ error: "invalid checkout" }, { status: 400 });
  }

  return NextResponse.json({ url: session.url });
}
