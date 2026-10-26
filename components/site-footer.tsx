import Link from "next/link";
import { copy, fill } from "@/content";
import { site } from "@/content/site";
import { competitors } from "@/lib/competitors";

const groups = [
  {
    title: copy.footer.shop,
    links: [
      { href: "/", label: copy.footer.home },
      { href: "/pricing", label: copy.nav.pricing },
      { href: "/login", label: copy.nav.signIn },
    ],
  },
  {
    title: copy.footer.trust,
    links: [
      { href: "/privacy", label: copy.nav.privacy },
      { href: "/security", label: copy.nav.security },
    ],
  },
  {
    title: copy.footer.compare,
    links: competitors.map((competitor) => ({
      href: `/vs/${competitor.slug}`,
      label: fill(copy.footer.vs, { competitor: competitor.name }),
    })),
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        {copy.footer.builtBy}{" "}
        <a href={site.maker.href} rel="noopener noreferrer">
          {site.maker.name}
        </a>
      </p>
      <nav className="site-footer-nav" aria-label={copy.nav.footer}>
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
