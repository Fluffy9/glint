![](docs/readme/sparkle.svg)

# Glint

**A band with no screen.**  
Heart rate, sleep, and movement stay in your browser first,  
and only leave if you choose to back them up.

[Live site](https://fluffy9.github.io/glint/) · [Dashboard](https://fluffy9.github.io/glint/dashboard) · Security · Health data

  


![Glint marketing hero: a band with no screen, beside the lavender packaging box](docs/readme/hero.png)

## Why?

I wanted to buy a fitness tracker without a screen and felt there weren't enough privacy friendly options. I started to vibe code something and this is where we are so far. 


## Packaging

WIP mockups

![Work-in-progress Glint packaging box, turning smoothly left and right](docs/readme/packaging.gif)

![Lavender packaging](docs/readme/packaging-lavender.png)   ![Mint packaging](docs/readme/packaging-mint.png)   ![Peach packaging](docs/readme/packaging-peach.png)   ![Sky packaging](docs/readme/packaging-sky.png)

Lavender · Mint · Peach · Sky

## Features


|                                           |                                                                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| ![](docs/readme/feature-no-bs.svg)        | **No BS** No ads, no streaks, no leaderboards, no monthly subscriptions.                                                                |
| ![](docs/readme/feature-screenless.svg)   | **No screen** It's low-key. It does one thing well, tracking your fitness. Not a replacement for your watch or your phone.              |
| ![](docs/readme/feature-offline.svg)      | **Local first** Made with an offline-first mentality. Data stays on your device, and in your browser, and in the cloud only optionally. |
| ![](docs/readme/feature-no-account.svg)   | **No account** The dashboard is free. No sign-in necessary.                                                                             |
| ![](docs/readme/feature-lock.svg)         | **Encrypted backup** Data is encrypted locally in your browser. Keys never leave your device.                                           |
| ![](docs/readme/feature-not-for-sale.svg) | **Never sold** There is no data held to be sold, and even if there was we wouldn't do it.                                               |
| ![](docs/readme/feature-export.svg)       | **Export anytime** Export however you'd like. Upload to Google Drive, or take a plain CSV or JSON copy of your data.                    |
| ![](docs/readme/feature-trash.svg)        | **Delete anytime** No logs retained, data is truly deleted on request.                                                                  |




## How it works

![Band to browser vault over Bluetooth, then optional paid ciphertext backup](docs/readme/how-it-works.svg)

## Repository

```text
glint/
├── app/                 Next.js routes (home, pricing, dashboard, …)
├── components/          Site UI, packaging box, dashboard
├── content/             Copy and site constants
├── design-system/       Tokens, components, brand + feature art
├── docs/                Security, health data, README art
├── functions/           Stripe webhook + backup API
├── lib/                 Vault, passkeys, band, commerce helpers
├── packaging/           Box mock source
└── scripts/             Seeds, README art export
```

## Run

```sh
pnpm install
cp .env.example .env
pnpm --dir functions install
pnpm dev
```

Checkout stays off until `NEXT_PUBLIC_STRIPE_LINK_BAND` and `NEXT_PUBLIC_STRIPE_LINK_BACKUP` are set.

### Local backup (emulators)

With no cloud keys in `.env`, `/dashboard` talks to local emulators through `/__glint/*`. Java 21+ is required.

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



## Tests

```sh
pnpm test
pnpm test:e2e
```

`pnpm test` also runs in the commit hook (with typecheck).

## README art

```sh
pnpm dev
pnpm export:readme
```

Assets land in `[docs/readme/](docs/readme/)`.