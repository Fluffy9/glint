# Glint feature icons

Eight landing-page points: no-bs, screenless, offline (works offline / backup optional), battery,
lock (encrypted data), not-for-sale (data never sold), export, trash (delete anytime).

## ui-24/
24px UI icons. Stroke and fill are `currentColor`, so they take whatever text colour they sit in.
Also available in the design system as `<Glint.Icon name="..."/>`: noBs, screenless, offline, battery,
lock, notForSale, export, trash.

## feature-160-themed/  (recolour with CSS)
160x128 illustrations. Every colour is a Glint token with a lavender-light fallback:
`--accent`, `--accent-soft`, `--accent-strong`, `--surface`, `--line`, `--shade`, `--ink-muted`, `--on-accent`.
Paste the SVG inline (not via <img>) on a page that sets those variables and it follows the theme,
including dark mode. Change one hue: set the three accent vars, e.g.
  --accent: oklch(0.82 0.09 160); --accent-soft: oklch(0.93 0.04 160); --accent-strong: oklch(0.46 0.13 160);
Each SVG uses its own pattern id (d-<name>) for the dithered shadow; if you inline the same one twice, rename the id.

## feature-160-flat/<colourway>/  (recoloured, plain hex)
The same illustrations baked to plain hex for lavender, mint, peach and sky, light and dark.
Use these in Figma, Keynote, <img> tags or anywhere CSS variables don't reach.
Any other colour: open the SVG and find-and-replace the hex values.

Card copy on the design canvas is placeholder. "Encrypted data", "Long battery" and "Never sold" are
promises; only publish them once they are true for the shipped product and hardware.
