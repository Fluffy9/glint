import { FeatureIcon, type FeatureIconId } from "@/components/feature-icons";
import { copy } from "@/content";

export function FeaturesSection() {
  return (
    <section className="section section-align-center" aria-labelledby="features">
      <h2 id="features" className="h2">
        {copy.features.heading}
      </h2>
      <p className="section-lede">{copy.features.lede}</p>

      <ul className="feature-grid">
        {copy.features.items.map((feature) => (
          <li key={feature.id} className="gl-win feature-card">
            <div className="gl-win-body">
              <FeatureIcon id={feature.id as FeatureIconId} className="feature-icon" />
              <p className="feature-card-title">{feature.title}</p>
              <p className="feature-card-body">{feature.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
