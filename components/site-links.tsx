import Link from "next/link";
import { copy } from "@/content";
import { ModeToggle } from "./mode-toggle";

export function SiteLinks() {
  return (
    <>
      <nav className="site-links" aria-label={copy.nav.site}>
        <Link href="/pricing">{copy.nav.pricing}</Link>
        <Link href="/privacy">{copy.nav.privacy}</Link>
        <Link href="/security">{copy.nav.security}</Link>
      </nav>
      <div className="site-actions">
        <Link className="site-signin" href="/dashboard">
          {copy.nav.dashboard}
        </Link>
        <ModeToggle />
      </div>
    </>
  );
}
