export const bandColors = [
  { id: "lavender", label: "Lavender" },
  { id: "mint", label: "Mint" },
  { id: "peach", label: "Peach" },
  { id: "sky", label: "Sky" },
] as const;

export type BandColor = (typeof bandColors)[number]["id"];
export type AppearanceMode = "light" | "dark";

export function themeAttribute(band: BandColor, mode: AppearanceMode): string {
  return `${band}-${mode}`;
}

export const defaultBand: BandColor = "lavender";
export const defaultMode: AppearanceMode = "light";
