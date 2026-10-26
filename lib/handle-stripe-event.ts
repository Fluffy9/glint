import type Stripe from "stripe";
import { upsertOrder, upsertSubscription } from "./commerce-db";

function customerId(value: string | { id: string } | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function periodEnd(subscription: Stripe.Subscription): Date | null {
  const end = subscription.items.data[0]?.current_period_end;
  return typeof end === "number" ? new Date(end * 1000) : null;
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const backup = session.metadata?.backup === "true";
    await upsertOrder({
      sessionId: session.id,
      customerId: customerId(session.customer),
      email: session.customer_details?.email ?? session.customer_email ?? null,
      band: session.metadata?.band !== "false",
      backup,
      amountTotal: session.amount_total,
      status: session.payment_status ?? "complete",
    });
    const subscription = customerId(session.subscription);
    if (subscription) {
      await upsertSubscription({
        subscriptionId: subscription,
        customerId: customerId(session.customer),
        status: "active",
        currentPeriodEnd: null,
      });
    }
    return;
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object;
    await upsertSubscription({
      subscriptionId: subscription.id,
      customerId: customerId(subscription.customer),
      status: event.type === "customer.subscription.deleted" ? "canceled" : subscription.status,
      currentPeriodEnd: periodEnd(subscription),
    });
  }
}
