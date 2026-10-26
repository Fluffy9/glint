# GlintFx

The full glint moment: a dithered `sheen` band sweeps diagonally across whatever it wraps (`dur-sheen`, 560ms), and a Twinkle pops at the corner just as the band leaves (260ms in).

- Wrap one element: a primary button on success, the goal ring, the box on the landing page, an achievement card.
- `trigger`: `"mount"` (default) or `"hover"`; `loop` in ms for marketing loops; change `play` to fire it from code (sync done, goal hit).
- `corner`: `tr` (default), `tl`, `br`, `bl`. The sheen travels toward that corner, with light coming from the top-left as it does everywhere else.
- `pixel={24}` for the pixel twinkle on brand surfaces; `radius` to match a rounded wrapper; `sheen` to change the band colour (it defaults to the `sheen` token, so on cream surfaces pass `var(--accent)`).
- The band is two layers: a 50% checker of `sheen` with a solid core. No gradients and no opacity, as in Shading.
- Never on data screens while numbers are changing, and never on more than one element at a time.
