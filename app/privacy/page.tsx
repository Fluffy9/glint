import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy · Glint",
  description: "What Glint stores today, and how encrypted backup works.",
};

export default function PrivacyPage() {
  return (
    <div className="site">
      <SiteHeader />
      <article className="prose">
        <h1 className="h1">Privacy</h1>
        <p>
          This website takes payment through Stripe. We store the email on the
          order, whether you bought the band, whether backup is on, and the
          status of that subscription. We do not collect heart rate, sleep, or
          activity here as plaintext.
        </p>
        <h2>On the phone</h2>
        <p>
          Tracking starts on your phone. A new phone does not have that copy
          until you restore it.
        </p>
        <h2>When backup is on</h2>
        <p>
          Backup is always encrypted before it leaves the phone. We store
          ciphertext only. We cannot read it. Another company cannot pull a
          readable copy from us.
        </p>
        <p>
          The website unlocks that copy with your password so you can see charts
          while you are signed in. The password is how decryption works. A
          password reset does not unlock old backup. If you lose the password
          and you do not have the phone copy or an export, that backup is gone.
        </p>
        <h2>Exports</h2>
        <p>
          You can export a plain CSV or JSON anytime, including to Google Drive
          or another place you pick. That export is not scrambled. Treat it like
          any other file you own.
        </p>
        <h2>Other apps</h2>
        <p>
          An app on your phone can receive a category from the phone. The phone
          already has the samples.
        </p>
        <p>
          Turning a category off deletes the copy we were allowed to hold.
          Deleting the account deletes the copies we have.
        </p>
        <p>
          We do not sell your data.{" "}
          <Link href="/security">Security</Link> lists what this site does today.
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
