import { readFileSync } from "node:fs";
import { join } from "node:path";

const themedDir = join(
  process.cwd(),
  "design-system/assets/FeatureIcons/feature-160-themed",
);

export const featureIconIds = [
  "no-bs",
  "screenless",
  "offline",
  "battery",
  "lock",
  "not-for-sale",
  "export",
  "trash",
] as const;

export type FeatureIconId = (typeof featureIconIds)[number];

type Props = {
  id: FeatureIconId;
  className?: string;
};

export function FeatureIcon({ id, className }: Props) {
  const raw = readFileSync(join(themedDir, `${id}.svg`), "utf8");
  const svg = raw
    .replace(/\srole="img"/, "")
    .replace(/\saria-label="[^"]*"/, "")
    .replace(
      "<svg ",
      `<svg class="${className ?? ""}" aria-hidden="true" focusable="false" `,
    );

  return (
    <span
      className="feature-icon-frame"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
