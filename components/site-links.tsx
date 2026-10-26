"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { copy } from "@/content";
import { clearAccountSession } from "@/lib/account-session";
import { useAccountChrome } from "@/lib/use-account-chrome";
import { ModeToggle } from "./mode-toggle";

export function SiteLinks() {
  const router = useRouter();
  const chrome = useAccountChrome();

  return (
    <>
      <nav className="site-links" aria-label={copy.nav.site}>
        <Link href="/pricing">{copy.nav.pricing}</Link>
        <Link href="/privacy">{copy.nav.privacy}</Link>
        <Link href="/security">{copy.nav.security}</Link>
      </nav>
      <div className="site-actions">
        {chrome === "checking" ? (
          <span className="site-signin-skeleton" role="status" aria-label={copy.account.checking} />
        ) : chrome === "in" ? (
          <>
            <Link className="site-signin" href="/account">
              <UserIcon />
              {copy.nav.account}
            </Link>
            <button
              type="button"
              className="site-signin"
              onClick={() => {
                clearAccountSession();
                router.replace("/login");
              }}
            >
              {copy.nav.signOut}
            </button>
          </>
        ) : (
          <Link className="site-signin" href="/login">
            <UserIcon />
            {copy.nav.signIn}
          </Link>
        )}
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
