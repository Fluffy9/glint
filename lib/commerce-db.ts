import pg from "pg";

export type OrderWrite = {
  sessionId: string;
  customerId: string | null;
  email: string | null;
  band: boolean;
  backup: boolean;
  amountTotal: number | null;
  status: string;
};

export type SubscriptionWrite = {
  subscriptionId: string;
  customerId: string | null;
  status: string;
  currentPeriodEnd: Date | null;
};

function connectionString(): string {
  const url = process.env.COMMERCE_DATABASE_URL;
  if (!url) {
    throw new Error("COMMERCE_DATABASE_URL is not set");
  }
  return url;
}

async function withClient<T>(run: (client: pg.Client) => Promise<T>): Promise<T> {
  const client = new pg.Client({ connectionString: connectionString() });
  await client.connect();
  try {
    return await run(client);
  } finally {
    await client.end();
  }
}

export async function upsertOrder(order: OrderWrite): Promise<void> {
  await withClient((client) =>
    client.query(
      `insert into commerce.orders (
         stripe_checkout_session_id, stripe_customer_id, email, band, backup, amount_total, status
       ) values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (stripe_checkout_session_id) do update set
         stripe_customer_id = excluded.stripe_customer_id,
         email = excluded.email,
         band = excluded.band,
         backup = excluded.backup,
         amount_total = excluded.amount_total,
         status = excluded.status`,
      [
        order.sessionId,
        order.customerId,
        order.email,
        order.band,
        order.backup,
        order.amountTotal,
        order.status,
      ],
    ),
  );
}

export async function upsertSubscription(subscription: SubscriptionWrite): Promise<void> {
  await withClient((client) =>
    client.query(
      `insert into commerce.subscriptions (
         stripe_subscription_id, stripe_customer_id, status, current_period_end, updated_at
       ) values ($1, $2, $3, $4, now())
       on conflict (stripe_subscription_id) do update set
         stripe_customer_id = excluded.stripe_customer_id,
         status = excluded.status,
         current_period_end = excluded.current_period_end,
         updated_at = now()`,
      [
        subscription.subscriptionId,
        subscription.customerId,
        subscription.status,
        subscription.currentPeriodEnd,
      ],
    ),
  );
}
