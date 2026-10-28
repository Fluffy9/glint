import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NewsletterForm } from "@/components/newsletter-form";
import { copy } from "@/content";

const sparklePath = join(
  process.cwd(),
  "design-system/assets/Backgrounds/sparkle-grid-smooth.svg",
);

function sparkleGrid() {
  return readFileSync(sparklePath, "utf8")
    .replace(/\srole="img"/, "")
    .replace(/\saria-label="[^"]*"/, "")
    .replace("<svg ", '<svg class="newsletter-sparkle" aria-hidden="true" ');
}

export function NewsletterSection() {
  return (
    <section className="section section-align-center" aria-labelledby="newsletter">
      <div className="newsletter-panel">
        <div
          className="newsletter-sparkle-wrap"
          dangerouslySetInnerHTML={{ __html: sparkleGrid() }}
        />
        <div className="newsletter-body">
          <h2 id="newsletter" className="h2">
            {copy.newsletter.heading}
          </h2>
          <p className="section-lede">{copy.newsletter.lede}</p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
