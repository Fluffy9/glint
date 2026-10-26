import { site, type ProductColorId } from "@/content/site";

export const bandColors = site.colors.map((color) => ({
  id: color.id,
  label: color.label,
}));

export type BandColor = ProductColorId;
export type AppearanceMode = "light" | "dark";

export function themeAttribute(band: BandColor, mode: AppearanceMode): string {
  return `${band}-${mode}`;
}

export const defaultBand: BandColor = site.defaultColor;
export const defaultMode: AppearanceMode = site.defaultMode;
