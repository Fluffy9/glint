# WarpCheck

The brand texture: a two-tone checkerboard pushed through a gentle sine warp, with the occasional Sparkle cut into an accent cell. It is generated, not drawn, so it always tiles seamlessly (the warp repeats exactly once per tile) and always matches the colorway.

- Colours: cells `accent`, ground `bg`, stars `bg`. Override with the CSS variables `--gl-warp-cell`, `--gl-warp-ground`, `--gl-warp-star` (use `accent-soft` cells for a quieter field behind text).
- Use on: the box and its inside lid, tissue paper, the landing-page hero, onboarding and splash screens, social backgrounds.
- Never on data screens, behind numbers, or on the band itself (fine lines don't survive embossing).
- Props: `cols`, `rows` (even), `cell` (px), `amp` (0–0.45 of a cell; 0.28 default), `seed` (pick and record one per print panel), `stars`, `width`/`height` to crop.
- `Glint.WarpCheck.geometry(opts)` returns the raw path data for print exports; `assets/Patterns/warp-check-tile.svg` is a ready tile.
