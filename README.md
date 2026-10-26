# Glint

Glint is a screenless fitness band. This repository is the website and the record of band and backup purchases.

The band is $69.99 once. It works with no subscription. Backup is $10 a year and optional. Canceling backup does not stop the band.

This website collects payment data through Stripe. It does not collect heart rate, sleep, or activity. The rules for storing that data later are in [docs/health-data.md](docs/health-data.md). What is already enforced, and what is still a human gate, is in [docs/security.md](docs/security.md).

## Run

```sh
pnpm install
cp .env.example .env
pnpm dev
```

Checkout stays disabled until `STRIPE_SECRET_KEY`, `STRIPE_PRICE_BAND`, and `STRIPE_PRICE_BACKUP` are set. Amounts on the page then come from those Stripe prices.

The webhook uses `COMMERCE_DATABASE_URL`, a Postgres connection for the `commerce_ingest` role. Apply [supabase/migrations/20261026000000_commerce.sql](supabase/migrations/20261026000000_commerce.sql) first. On a hosted database, give that role a password outside the migration and put the connection string in `.env`. To receive events locally:

```sh
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Tests

```sh
pnpm test
pnpm test:db
```

`pnpm test` typechecks in the commit hook as well. `pnpm test:db` needs Docker. Run it before merging a change to the commerce migration. It checks that browser roles cannot read orders and that the webhook role cannot read a health table.
