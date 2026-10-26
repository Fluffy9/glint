import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid session" }, { status: 400 });
  }

  const sessionId =
    body &&
    typeof body === "object" &&
    "sessionId" in body &&
    typeof body.sessionId === "string"
      ? body.sessionId
      : null;

  if (!sessionId || !sessionId.startsWith("cs_") || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "invalid session" }, { status: 400 });
  }

  const checkout = await getStripe().checkout.sessions.retrieve(sessionId);
  const customer = typeof checkout.customer === "string" ? checkout.customer : checkout.customer?.id;
  if (!customer) {
    return NextResponse.json({ error: "invalid session" }, { status: 400 });
  }

  const portal = await getStripe().billingPortal.sessions.create({
    customer,
    return_url: siteUrl(),
  });

  return NextResponse.json({ url: portal.url });
}
