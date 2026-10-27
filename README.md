# Glint

Glint is a screenless fitness band. You buy it once. Heart rate, sleep, and movement stay in your browser first. Optional encrypted backup is the only paid cloud piece, and the band keeps working if you skip it.

This repository is the marketing site, the browser vault on `/dashboard`, Stripe checkout records, and the Cloud Functions that store ciphertext. It is not a cloud fitness account.

Planned prices: **$69.99** for the band once, **$10** a year for backup. Checkout is Stripe Payment Links. Amounts on the page come from Stripe when configured, otherwise from fallbacks in `lib/prices.ts`.

## How it works

```text
Band (Web Bluetooth) ──► browser encrypts samples ──► IndexedDB vault
                                                         │
                              paid backup (optional) ────┘
                                                         ▼
                                              Firebase Storage (ciphertext only)
```

There is **no sign-in and no Firebase Auth user**. A vault is local:

1. The browser creates a data key and wraps it with a passkey (WebAuthn PRF) and a one-time recovery key.
2. `localStorage` only records that a vault exists so the first paint can show Create or Unlock. IndexedDB holds the wraps and sample ciphertext.
3. Unlock is passkey or pasted recovery key. A new Stripe payment does not unwrap old ciphertext.
4. If backup is paid, the browser redeems a short-lived upload capability from the paid checkout (email + `vaultId`). Cloud Functions check that capability and `paidUntil`, then write blobs the client cannot overwrite. The server never sees the data key or plaintext samples.

Details: [docs/health-data.md](docs/health-data.md) and [docs/security.md](docs/security.md).

## Repository map

| Area | Role |
| --- | --- |
| `app/`, `components/`, `content/` | Next.js site (landing, pricing, compare, privacy, security, dashboard) |
| `lib/vault-*.ts`, `lib/passkey.ts`, `lib/band.ts` | Local vault, passkeys, band / fixture source |
| `functions/` | Stripe webhook, redeem / upload / download / delete backup, renewal jobs |
| `firestore.rules`, `storage.rules` | Clients cannot write orders or backup objects |
| `docs/` | Health destinations and security controls |

Dev-only dashboard fixtures and page screenshots load only when `NODE_ENV === "development"`. They are not part of production builds.

## Run

```sh
pnpm install
cp .env.example .env
pnpm --dir functions install
pnpm dev
```

Checkout stays off until `NEXT_PUBLIC_STRIPE_LINK_BAND` and `NEXT_PUBLIC_STRIPE_LINK_BACKUP` are set.

### Local backup (emulators)

With no Firebase keys in `.env`, `/dashboard` talks to Firebase emulators through `/__glint/*`. Java 21+ is required.

```sh
pnpm emulators
```

In another terminal:

```sh
pnpm seed:purchase buyer@example.com
pnpm dev
```

Open `http://localhost:3000/dashboard` (or `127.0.0.1`) and stay on that host. Create or unlock a vault, redeem the seeded session, then upload or restore ciphertext. Forward real Payment Links with:

```sh
stripe listen --forward-to http://127.0.0.1:5001/glint-local/us-central1/stripeWebhook
```

`COMMERCE_DATABASE_URL` is only for the older Supabase commerce schema test. Apply [supabase/migrations/20261026000000_commerce.sql](supabase/migrations/20261026000000_commerce.sql) before `pnpm test:db`. Live purchases land in Firestore.

## Tests

```sh
pnpm test
pnpm test:db
pnpm test:e2e
```

`pnpm test` also runs in the commit hook (with typecheck). `pnpm test:db` needs Docker; run it before merging a commerce migration.
