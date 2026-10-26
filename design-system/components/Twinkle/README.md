# Twinkle

The glint: the Sparkle animated. It is drawn by a small function rather than keyframes, so it stays crisp at any size and can render as pixel art.

- **Timeline (`dur-glint`, 900ms):** 0–200ms it pops in with overshoot; the vertical rays stretch to 1.45× while the horizontal rays stay at 0.74×, so it reads as a glint, not a plus sign. A thin ring flashes outward, and a smaller diagonal star trails 50ms behind. It holds until about 380ms, then collapses to a point while turning about 25°.
- **Vector** (default) for the app, 60fps. **Pixel** (`pixel={16|24|32}`, the grid size) for marketing, splash and onboarding: drawn on a tiny canvas, thresholded to hard pixels and stepped at 12fps (`frame-pixel`).
- Props: `size`, `color` (default `accent-strong`; use `sheen` on pastel fills), `delay`, `loop` (ms between plays), `play` (change it to replay), `autoplay={false}` with `restAt={0–1}` to show one frame.
- The peak lands about 200ms in. Fire the band's celebrate haptic at the same moment as `play`, so the buzz and the visual peak line up.
- With reduced motion it shows one static frame (`restAt`, default 0.3).
- Same rules as the Sparkle: only for something earned, once per event, one at a time on a screen.
