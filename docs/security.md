# Security

Controls are either enforced by a test or marked as a human gate. Add a control in the same change as its test. Do not describe a later control as if it were already on the public security page.

## In place

| Control | Enforced by |
| --- | --- |
| Card data stays on Stripe Checkout. This app has no card fields. | Human gate. Review the checkout route when it changes. |
| Webhook writes require a valid Stripe signature, and errors do not echo the body. Subscription events do not change backup. | Webhook signature test |
| Backup turns on only from Payment Link metadata `backup=true`. | Payment link metadata test |
| Security headers, including a script policy with no open source and no framing. HSTS is production-only. | Browser headers test |
| Client components cannot see server secrets. `NEXT_PUBLIC_` names must be listed in `lib/public-env.ts`. | Secrets stay on the server test |
| Commerce tables force row-level security. `commerce_ingest` is the only role with a policy. There are no health columns. | Commerce schema test |
| The browser roles cannot read orders. `commerce_ingest` can write an order and cannot read `health`. | Commerce role test, `pnpm test:db` |
| The webhook path does not import health storage. | Commerce schema test |
| Account delete removes storage, object docs, and the auth user, in that order, and leaves the Stripe order. | Account delete test |
| Backup blobs are ciphertext. The passphrase is not stored next to them. | Passphrase backup crypto test |
| Storage rules require the signed-in owner and a future `paidUntil`. | Firebase rules test |
| The public security page does not claim HIPAA, SOC 2, or military-grade protection. | Public claims test |

`pnpm test` runs every test except the database one. Run `pnpm test:db` before merging a migration. It needs Docker.

## Human gates before health data is stored

- The Firebase project used in production is separate from local emulators. Stripe, Firebase, and GitHub logins use multi-factor authentication. There is no shared admin password.
- Sign-in is an email link. The backup passphrase stays on the device. A password reset does not unwrap old ciphertext.
- Backup is encrypted before upload. Passphrase material is never stored on the server. A key version is stored so a later rotation has a place to land.
- Firebase Storage is private. Rules allow the signed-in owner only while backup is paid. Deleting the account removes ciphertext, object docs, and the sign-in. Stripe keeps the receipt.
- Logs and error reports carry record ids, not sample bodies or tokens.
- The phone app is confirmed as the only uploader, or the privacy page names the other recipient. See [health-data.md](health-data.md).
- Counsel reviews the policy before real health data is stored, and before deletion is stated as a current fact. If readable health data or order email is exposed, tell the affected customers.

Dependabot, or the equivalent, turns on for this GitHub repository. A third-party penetration test is not part of this slice, and the security page does not imply one happened.
