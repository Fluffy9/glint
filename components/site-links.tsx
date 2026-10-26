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
        <Link className="site-signin" href="/login">
          <UserIcon />
          {copy.nav.signIn}
        </Link>
        <ModeToggle />
      </div>
    </>
  );
}

function UserIcon() {
  return (
    <svg
      className="nav-glyph"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 21" />
    </svg>
  );
}
