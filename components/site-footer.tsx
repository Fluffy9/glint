import Link from "next/link";
import { competitors } from "@/lib/competitors";

const groups = [
  {
    title: "Shop",
    links: [
      { href: "/", label: "Home" },
      { href: "/pricing", label: "Pricing" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Compare",
    links: competitors.map((competitor) => ({
      href: `/vs/${competitor.slug}`,
      label: `vs ${competitor.name}`,
    })),
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        built by{" "}
        <a href="https://pupcakes.me" rel="noopener noreferrer">
          @Pupcakes
        </a>
      </p>
      <nav className="site-footer-nav" aria-label="Footer">
        {groups.map((group) => (
          <div key={group.title} className="site-footer-group">
            <p className="site-footer-label">{group.title}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </footer>
  );
}
