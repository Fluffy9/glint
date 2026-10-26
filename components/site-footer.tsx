import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>The band is $69.99 once. Backup is $10 a year, and it is optional.</p>
      <nav aria-label="Footer">
        <Link href="/privacy">Privacy</Link>
        <Link href="/security">Security</Link>
      </nav>
    </footer>
  );
}
