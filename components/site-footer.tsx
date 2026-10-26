import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        built by{" "}
        <a href="https://pupcakes.me" rel="noopener noreferrer">
          Pupcakes
        </a>
      </p>
      <nav aria-label="Footer">
        <Link href="/privacy">Privacy</Link>
        <Link href="/security">Security</Link>
      </nav>
    </footer>
  );
}
