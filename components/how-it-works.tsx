import { readFileSync } from "node:fs";
import { join } from "node:path";
import { copy } from "@/content";

const diagramDir = join(process.cwd(), "design-system/assets/FeatureIcons/diagram-themed");

function diagram(name: string) {
  return readFileSync(join(diagramDir, name), "utf8")
    .replace(/\srole="img"/, "")
    .replace(/\saria-labelledby="[^"]*"/, "")
    .replace(/<title[^>]*>.*?<\/title>/, "");
}

export function HowItWorks() {
  const wide = diagram("how-it-works-wide.svg").replace(
    "<svg ",
    '<svg class="how-diagram" role="img" aria-label="How Glint works" ',
  );
  const stacked = diagram("how-it-works-stacked.svg").replace(
    "<svg ",
    '<svg class="how-diagram" role="img" aria-label="How Glint works" ',
  );

  return (
    <section className="section section-align-center" aria-labelledby="how">
      <h2 id="how" className="h2">
        {copy.how.heading}
      </h2>
      <p className="section-lede">{copy.how.lede}</p>
      <div className="how-wide" dangerouslySetInnerHTML={{ __html: wide }} />
      <div className="how-stacked" dangerouslySetInnerHTML={{ __html: stacked }} />
    </section>
  );
}
