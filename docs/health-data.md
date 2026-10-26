# Health data

Glint does not collect heart rate, sleep, or activity on this website as plaintext. The rules below are the contract for the phone app, so the first health table cannot land in `commerce`.

## Destinations

Activity, heart, and sleep each live in one of these places:

- **On this phone.** Nothing in that category is uploaded.
- **Encrypted backup.** The phone encrypts the category, then uploads ciphertext. The server stores the blob, a nonce, and a key version. It does not store readable samples. Decryption uses the customer’s password (or a key derived from it). A password reset does not unwrap old ciphertext. If the password is gone and there is no phone copy or export, that backup is gone.
- **Plain export.** The customer can write an unencrypted CSV or JSON, including to Google Drive or another place they pick. That file is outside Glint’s ciphertext model.

The default is on this phone. If the customer pays for backup, uploads are always encrypted. There is no server-readable “in your account” health copy. The website decrypts with the password only while the customer is signed in and looking.

Other apps on the phone can receive a category from the phone. Grants that pull from Glint cloud data only see what the customer’s session can decrypt. Grants are per app, per category, and revocable. Each grant stores who, what, which explanation the customer saw, and when.

Turning a category off deletes the copy that is no longer allowed. Account deletion deletes ciphertext objects and grants. Glint cannot backfill samples it never received in the clear.

## Schemas and roles

`commerce` holds orders and subscriptions. `health` will hold ciphertext metadata, destinations, and grants. The Stripe webhook connects as `commerce_ingest`, which is granted only on `commerce`.

Enforced by the Commerce schema test and the Commerce role test (`pnpm test:db`).

Ciphertext is fetched with the signed-in customer's token and decrypted with material derived from their password. The service role is not a health-data tool, and it is not in this app.

## Before the first health byte

These are human gates:

- Supabase Auth exists, email is verified, and a destination row records the disclosure version the customer accepted.
- Backup uses client-side encryption. The password-derived key material is never stored on the server in a form that lets staff decrypt blobs offline.
- The phone app is confirmed as the only component that uploads health data. If some other software on the band path also sends it, the privacy page names that recipient.
- Counsel reviews the privacy policy, including the FTC Health Breach Notification Rule and applicable state law, before real health data is stored. Do not describe Glint as HIPAA compliant.
