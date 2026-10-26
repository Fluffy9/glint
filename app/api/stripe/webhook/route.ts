import { NextResponse } from "next/server";
import { handleStripeEvent } from "@/lib/handle-stripe-event";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const body = await request.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    await handleStripeEvent(event);
  } catch (error) {
    const id = event.id;
    console.error("stripe webhook failed", id, error instanceof Error ? error.name : "error");
    return NextResponse.json({ error: "could not record the event" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
