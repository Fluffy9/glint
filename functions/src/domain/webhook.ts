import Stripe from "stripe";
import { applyPaidSession, type BackupState, type PaidSession } from "./state";

export function paidSessionFromCheckout(
  session: Stripe.Checkout.Session,
  paidAt: Date,
): PaidSession {
  const customer = session.customer;
  const customerId = !customer ? null : typeof customer === "string" ? customer : customer.id;
  return {
    id: session.id,
    email: session.customer_details?.email ?? session.customer_email ?? null,
    customerId,
    amountTotal: session.amount_total,
    paymentStatus: session.payment_status ?? "unpaid",
    band: session.metadata?.band !== "false",
    backup: session.metadata?.backup === "true",
    paidAt,
  };
}

export async function postStripeWebhook(
  request: Request,
  state: BackupState,
  env: { stripeSecretKey: string; webhookSecret: string },
  now = new Date(),
): Promise<{ response: Response; state: BackupState }> {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !env.webhookSecret || !env.stripeSecretKey) {
    return {
      response: Response.json({ error: "invalid signature" }, { status: 400 }),
      state,
    };
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = new Stripe(env.stripeSecretKey).webhooks.constructEvent(body, signature, env.webhookSecret);
  } catch {
    return {
      response: Response.json({ error: "invalid signature" }, { status: 400 }),
      state,
    };
  }

  if (event.type !== "checkout.session.completed") {
    return { response: Response.json({ received: true }), state };
  }

  const next = applyPaidSession(state, paidSessionFromCheckout(event.data.object, now));
  return { response: Response.json({ received: true }), state: next };
}
