import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy · Glint",
  description: "What Glint stores today, and the choice you get when backup exists.",
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
          activity here.
        </p>
        <h2>When backup is on</h2>
        <p>
          Activity, heart, and sleep each get their own destination. You pick.
        </p>
        <ul>
          <li>
            On this phone. That category is not uploaded. A new phone does not
            have it.
          </li>
          <li>
            Locked backup. The phone scrambles it before upload. We store the
            scrambled copy and cannot read it, so it will not show when you log
            in on the web, and another company cannot pull it from us. Restoring
            it takes a recovery key. Resetting your password does not unlock it.
            If you lose the key, the backup is gone.
          </li>
          <li>
            In your account. We can read that category. That is what lets charts
            load after you sign in. The database host encrypts the disks, and
            only your login can fetch the rows, but anyone who administers the
            database can read this copy. The screen says that before you turn it
            on.
          </li>
        </ul>
        <p>
          The starting point is on this phone. If you pay for backup, the
          starting point is locked backup. Charts and remote apps stay off until
          you turn them on.
        </p>
        <h2>Other apps</h2>
        <p>
          An app on your phone can receive a category from the phone, including
          when the cloud copy is locked. The phone already has the samples.
        </p>
        <p>
          An app that pulls from your Glint account can receive a category only
          when that category is in your account. A locked backup has nothing for
          them to fetch. You can revoke a grant.
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
