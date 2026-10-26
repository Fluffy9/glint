# Glint design system: how to use

Open `index.html` in a browser to browse every component. Pick a theme in the top bar. Everything works offline except the Google Fonts (Pixelify Sans, DM Sans, DM Mono), which load from the internet; without a connection the system falls back to default fonts.

## Folders
- `tokens/tokens.json`: every token (colour per theme, type, spacing, radius, shadow, stroke, dither, motion) with usage notes. This is the source of truth.
- `tokens/tokens.css`: the same tokens as CSS variables. Set `data-theme="lavender-light"` (or `mint-dark`, `peach-light`, `sky-dark` and so on) on `<html>`.
- `components/bundle.css` and `components/bundle.js`: styles and React components (`window.Glint`). `index.d.ts` has the types.
- `components/<Name>/README.md`: guidance for each component. `preview/`: runnable examples.
- `assets/`: the sparkle and pattern SVGs. `README.md` and `surfaces.md`: the brand book.
- `vendor/`: React 18 copies so the previews run offline.

## Use in a web page
```html
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<script src="vendor/react.production.min.js"></script>
<script src="vendor/react-dom.production.min.js"></script>
<script src="components/bundle.js"></script>
```
Then use `Glint.Button`, `Glint.Card`, `Glint.Twinkle` and the rest. Colour tokens are CSS variables such as `var(--accent)`.

## Notes
- The `tokens.css` file was generated from `tokens.json`. If you edit the JSON, regenerate the CSS.
- Brand artwork, the star lattice, the box and the canvas explorations are not in this folder. They live on the design canvas.
