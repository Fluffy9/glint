/**
 * Things that change the whole site when you edit them.
 * Band hues also have to match design-system/tokens/tokens.css.
 * A test checks that the light accent hue for each color is still in that file.
 */
export const site = {
  name: "Glint",
  locale: "en",
  maker: {
    name: "@Pupcakes",
    href: "https://pupcakes.me",
  },
  colors: [
    { id: "lavender", label: "Lavender", hue: 300 },
    { id: "mint", label: "Mint", hue: 160 },
    { id: "peach", label: "Peach", hue: 55 },
    { id: "sky", label: "Sky", hue: 235 },
  ],
  defaultColor: "lavender",
  defaultMode: "light",
} as const;

export type ProductColorId = (typeof site.colors)[number]["id"];
