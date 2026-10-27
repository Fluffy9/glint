# Glint feature icons

Landing-page points: no-bs, screenless, offline (local first, backup optional), no-account, lock (encrypted backup),
not-for-sale (data never sold), export, trash (delete anytime), battery (spare until there's a measured number).
Plus a how-it-works diagram, in a wide layout for desktop and a stacked one for phones.

## ui-24/
24px UI icons. Stroke and fill are `currentColor`, so they take whatever text colour they sit in.
Also available in the design system as `<Glint.Icon name="..."/>`: noBs, screenless, offline, battery,
lock, notForSale, export, trash, noAccount, key.

## feature-160-themed/  (recolour with CSS)
160x128 illustrations. Every colour is a Glint token with a lavender-light fallback:
`--accent`, `--accent-soft`, `--accent-strong`, `--surface`, `--line`, `--shade`, `--ink-muted`, `--on-accent`.
Paste the SVG inline (not via <img>) on a page that sets those variables and it follows the theme,
including dark mode. Change one hue: set the three accent vars, e.g.
  --accent: oklch(0.82 0.09 160); --accent-soft: oklch(0.93 0.04 160); --accent-strong: oklch(0.46 0.13 160);
Each SVG uses its own pattern id (d-<name>) for the dithered shadow; if you inline the same one twice, rename the id.

## diagram-themed/ and diagram-flat/<colourway>/
how-it-works-wide.svg (1190x540) for desktop, how-it-works-stacked.svg (420 wide) for phones.
Swap them with a media query or <picture>. Themed versions recolour like the illustrations and also read
`--bg` for the small plates behind arrow labels; flat versions are baked with a solid background.
The text in the diagram is plain SVG text in DM Sans / DM Mono: it is real, selectable text, so if you
change the copy, edit mk_diagram.py's strings (or the SVG) rather than an image.

## feature-160-flat/<colourway>/  (recoloured, plain hex)
The same illustrations baked to plain hex for lavender, mint, peach and sky, light and dark.
Use these in Figma, Keynote, <img> tags or anywhere CSS variables don't reach.
Any other colour: open the SVG and find-and-replace the hex values.

Card copy on the design canvas is placeholder. "Encrypted data", "Long battery" and "Never sold" are
promises; only publish them once they are true for the shipped product and hardware.
