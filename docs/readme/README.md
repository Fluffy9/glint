# README art

Exports used by the root `README.md`. Regenerate from a running site:

```sh
pnpm dev
pnpm export:readme
```

| File | Source |
| --- | --- |
| `hero.png`, `packaging-*.png` | Playwright capture of `/` |
| `packaging.gif` | Smooth left/right yaw of the hero pack pose (`export-packaging-gif.mjs`) |
| `how-it-works.svg`, `feature-*.svg` | `design-system/assets/FeatureIcons/` (lavender-light) |
| `sparkle.svg`, `sparkle-outlined.svg` | `design-system/assets/Brand/` |
| `warp-check-tile.svg` | `design-system/assets/Patterns/` |
