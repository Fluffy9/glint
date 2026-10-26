# Health data

Glint does not collect heart rate, sleep, or activity on this website. The rules below are the contract for the phone app, so the first health table cannot land in `commerce`.

## Destinations

Activity, heart, and sleep each have one destination:

- **On this phone.** Nothing in that category is uploaded.
- **Locked backup.** The phone encrypts the category, then uploads ciphertext. The server stores the blob, a nonce, and a key version. It does not store samples. The customer holds the recovery key. A password reset does not unwrap it.
- **In your account.** The server can read that category so charts can load after sign-in. Disk encryption and row-level security still apply. Database administrators can read this copy. The opt-in text says that.

The default is on this phone. If the customer pays for backup, the default is locked backup. Account access starts off.

Other apps on the phone can receive a category from the phone even when the cloud copy is locked. Apps that pull from the Glint account can receive a category only when its destination is in the account. Grants are per app, per category, and revocable. Each grant stores who, what, which explanation the customer saw, and when.

Changing a destination deletes the copy that is no longer allowed. Account deletion deletes readable rows, locked objects, and grants. Glint cannot backfill samples it never received.

## Schemas and roles

`commerce` holds orders and subscriptions. `health` will hold ciphertext metadata, readable samples, destinations, and grants. The Stripe webhook connects as `commerce_ingest`, which is granted only on `commerce`.

Enforced by the Commerce schema test and the Commerce role test (`pnpm test:db`).

Readable health rows, when they exist, are read with the signed-in customer's token. The service role is not a health-data tool, and it is not in this app.

## Before the first health byte

These are human gates:

- Supabase Auth exists, email is verified, and a destination row records the disclosure version the customer accepted.
- Locked backup uses client-side encryption. The recovery key is never sent to the server.
- The phone app is confirmed as the only component that uploads health data. If some other software on the band path also sends it, the privacy page names that recipient.
- Counsel reviews the privacy policy, including the FTC Health Breach Notification Rule and applicable state law, before real health data is stored. Do not describe Glint as HIPAA compliant.
