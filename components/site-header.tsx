import Link from "next/link";
import { ColorwaySwitch } from "./colorway-switch";
import { SparkleMark } from "./sparkle-mark";

export function SiteHeader() {
  return (
    <header className="site-nav">
      <Link href="/" className="wordmark">
        <SparkleMark />
        Glint
      </Link>
      <div className="site-nav-rest">
        <nav className="site-links" aria-label="Site">
          <Link href="/privacy">Privacy</Link>
          <Link href="/security">Security</Link>
        </nav>
        <ColorwaySwitch />
      </div>
    </header>
  );
}
