import Link from "next/link";
import { site } from "@/content/site";
import { SiteLinks } from "./site-links";
import { SparkleMark } from "./sparkle-mark";

export function SiteHeader() {
  return (
    <header className="site-nav">
      <Link href="/" className="wordmark">
        <SparkleMark />
        {site.name}
      </Link>
      <SiteLinks />
    </header>
  );
}
