# CheckerWipe

A full-surface transition for onboarding steps, the site and the splash screen. Square cells step in along the diagonal in three frames each (`ease-step`). Odd cells start 90ms after even ones, so the screen passes through the brand's checker on the way to solid. `onCovered` fires once it is fully covered: swap the content there. The cells then step out in the same order, and a pixel Twinkle pops in the middle.

- Put it inside a `position: relative` container that clips (`overflow: hidden`). Change `play` (a counter) to run it.
- `cell` (default 48px; use `space-12`-ish sizes, never smaller than 24), `color` (default `accent`), `stagger` (ms per diagonal step, default 16), `glint={false}` to skip the sparkle.
- Total time is roughly `2 × ((cols + rows) × stagger + 290ms)`. Keep it under about 900ms on phones by using larger cells.
- **Not for in-app navigation.** Inside the app, screens change with a dither dissolve (`.gl-dissolve-in`, `dur-base`). The wipe is a brand moment.
- With reduced motion it calls `onCovered` immediately and draws nothing.
