# Security

Controls are either enforced by a test or marked as a human gate. Add a control in the same change as its test. Do not describe a later control as if it were already on the public security page.

## In place

| Control | Enforced by |
| --- | --- |
| Card data stays on Stripe Checkout. This app has no card fields. | Human gate. Review the checkout route when it changes. |
| Webhook writes require a valid Stripe signature, and errors do not echo the body. | Webhook signature test |
| Checkout accepts `{ backup: boolean }` and nothing else. | Checkout allowlist test |
| Security headers, including a script policy with no open source and no framing. HSTS is production-only. | Browser headers test |
| Client components cannot see server secrets. `NEXT_PUBLIC_` names must be listed in `lib/public-env.ts`. | Secrets stay on the server test |
| Commerce tables force row-level security. `commerce_ingest` is the only role with a policy. There are no health columns. | Commerce schema test |
| The browser roles cannot read orders. `commerce_ingest` can write an order and cannot read `health`. | Commerce role test, `pnpm test:db` |
| The webhook path does not import health storage. | Commerce schema test |
| The public security page does not claim HIPAA, SOC 2, or military-grade protection. | Public claims test |

`pnpm test` runs every test except the database one. Run `pnpm test:db` before merging a migration. It needs Docker.

## Human gates before health data is stored

- Production Supabase is a different project from development. Logins for Supabase, Stripe, Vercel, and GitHub use multi-factor authentication. There is no shared admin password.
- Accounts use verified email, a breached-password check, and multi-factor authentication for anyone who turns on "in your account."
- Locked backup is encrypted on the phone. The recovery key never reaches the server. A key version is stored so a later rotation has a place to land.
- Health rows are read with that customer's session. The storage bucket is private. Deleting the account, or turning a category off, removes the copy.
- Logs and error reports carry record ids, not sample bodies or tokens.
- The phone app is confirmed as the only uploader, or the privacy page names the other recipient. See [health-data.md](health-data.md).
- Counsel reviews the policy before real health data is stored, and before deletion is stated as a current fact. If readable health data or order email is exposed, tell the affected customers.

Dependabot, or the equivalent, turns on for this GitHub repository. A third-party penetration test is not part of this slice, and the security page does not imply one happened.
