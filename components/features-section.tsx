import {
  FeatureIcon,
  type FeatureIconId,
} from "@/components/feature-icons";

const features: {
  id: FeatureIconId;
  title: string;
  body: string;
}[] = [
  {
    id: "no-bs",
    title: "No BS",
    body: "Plain language about what the band stores and what leaves the phone.",
  },
  {
    id: "screenless",
    title: "No screen",
    body: "Nothing on your wrist to check mid-run. The band keeps the record.",
  },
  {
    id: "offline",
    title: "Works offline",
    body: "Tracking stays on the phone. Backup is optional, and you can skip it.",
  },
  {
    id: "battery",
    title: "Long battery",
    body: "Days of wear between charges, not another nightly dock ritual.",
  },
  {
    id: "lock",
    title: "Encrypted data",
    body: "On the phone by default. Optional backup is scrambled before it goes out.",
  },
  {
    id: "not-for-sale",
    title: "Never sold",
    body: "Your heart rate is not a product, a feed, or an ad target.",
  },
  {
    id: "export",
    title: "Export anytime",
    body: "Take a CSV or JSON copy whenever you want, including a plain file to Google Drive.",
  },
  {
    id: "trash",
    title: "Delete anytime",
    body: "Turn a category off and that copy is gone. Delete the account and so are we.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section" aria-labelledby="features">
      <h2 id="features" className="h2">
        Fitness tracking that just works
      </h2>
      <p className="section-lede">
        You buy the band once, keep the data, and skip the subscription theatre.
      </p>

      <ul className="feature-grid">
        {features.map((feature) => (
          <li key={feature.id} className="gl-win feature-card">
            <div className="gl-win-body">
              <FeatureIcon id={feature.id} className="feature-icon" />
              <p className="feature-card-title">{feature.title}</p>
              <p className="feature-card-body">{feature.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
