# Glint

Glint is a screenless fitness band. This repository is the website and the record of band and backup purchases.

The band is $69.99 once. It works with no subscription. Backup is $10 for a year and optional. When the year is close, we email a new payment link. Skipping backup does not stop the band.

This website collects payment data through Stripe. It does not collect heart rate, sleep, or activity. The rules for storing that data later are in [docs/health-data.md](docs/health-data.md). What is already enforced, and what is still a human gate, is in [docs/security.md](docs/security.md).

## Run

```sh
pnpm install
cp .env.example .env
pnpm dev
```

Checkout stays disabled until `NEXT_PUBLIC_STRIPE_LINK_BAND` and `NEXT_PUBLIC_STRIPE_LINK_BACKUP` are set. Those are Stripe Payment Links (one for the band, one for a year of backup). Amounts on the page come from `STRIPE_PRICE_BAND` and `STRIPE_PRICE_BACKUP` when `STRIPE_SECRET_KEY` is set, and otherwise from the fallback prices.

Backup storage is Firebase. In `pnpm dev`, with no Firebase keys in `.env`, the account page talks to the local emulators. Java 21+ is required.

```sh
pnpm --dir functions install
pnpm emulators
```

In another terminal, `pnpm dev`, then record a paid year and open the account page:

```sh
pnpm seed:purchase buyer@example.com
```

Open `http://localhost:3000/account` or `http://127.0.0.1:3000/account` and stay on that host. Use the seeded email. The emulator does not send mail. Click “Open the sign-in link”, then save a test backup with a passphrase of at least 8 characters. Type `DELETE` to remove the account. Real Stripe Payment Links can hit the same webhook:

```sh
stripe listen --forward-to http://127.0.0.1:5001/glint-local/us-central1/stripeWebhook
```

`COMMERCE_DATABASE_URL` is only for the older commerce schema test. Apply [supabase/migrations/20261026000000_commerce.sql](supabase/migrations/20261026000000_commerce.sql) before `pnpm test:db`. New purchases are stored in Firestore, not that database.

## Tests

```sh
pnpm test
pnpm test:db
```

`pnpm test` typechecks in the commit hook as well. `pnpm test:db` needs Docker. Run it before merging a change to the commerce migration. It checks that browser roles cannot read orders and that the webhook role cannot read a health table.
