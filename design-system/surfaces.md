# Surfaces

The band has no screen, so the brand lives across four surfaces. Each one uses the same hue as the band the person owns.

## 1. The app

Carries nearly all of the interface. Home is one ProgressRing (the day's goal), a row of Stats and stacked Cards. Theme the app from the paired band's colorway automatically, and let people override it in settings. Keep the warp check to splash, onboarding and empty states.

## 2. The band

- Strap in the colorway pastel, with a darker edge paint (close to `accent-strong`) so the shape reads against skin and clothing.
- Deboss the monogram repeat (`assets/Patterns/monogram-tile.svg`) tone-on-tone. Tone-on-tone is subtle on pastel, so use a deep deboss or a satin foil to keep it legible.
- Minimum feature size for emboss: about 1.2 mm wide and 1 mm apart. At a 36 mm tile on a 20 mm strap, the sparkle and medallion both pass; don't scale the tile below 30 mm.
- Test light dyes against sweat and UV before committing. A coated or leather-grain silicone keeps the look with less staining.
- The white-label pod stays charcoal; the only mark on it is a small Sparkle if the supplier allows a print or laser mark.

## 3. Haptics and light

Treat haptic patterns as the band's micro-interactions. Each one has a visual twin in the app so the buzz and the screen feel like one event.

| Event | Haptic | App twin |
| --- | --- | --- |
| Goal hit | short, short, long ("sparkle") | Sparkle appears on the ProgressRing |
| Move nudge | two soft taps | Info Alert: "Time to stretch" |
| Sync complete | one short tap | `sync` icon settles, Stat values update |
| Low battery | three slow pulses | Warning Alert |
| Streak milestone | sparkle pattern twice | Sparkle 56px with the streak count |

If the hardware has an LED, use `accent` for success moments and `warning` for battery, and never blink red.

Confirm with the supplier whether haptic and LED patterns are configurable in firmware; if not, map these events to the closest built-in patterns.

## 4. Packaging, charger and site

- Box exterior and inside lid: the warp check in the band's colorway, a `surface` label window with the name in Pixelify Sans and the Sparkle.
- Tissue and stickers: warp check with stars, or the monogram repeat in a single ink.
- Charger: charcoal with a small debossed Sparkle.
- Landing page: overlapping windows on `bg`, the warp check in the hero, bracketed primary CTAs, product renders in each colorway.
- Choose four to six launch colorways and get physical swatches before finalizing hex values.
