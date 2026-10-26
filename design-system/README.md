Glint is a screenless fitness band and the app that gives it a face. The look is a soft-retro desktop: cream and charcoal windows with thick ink outlines and hard offset shadows, one pastel that changes with the band you own, a four-point sparkle for every win, and a warped checker for the moments that are pure brand.

## Principles

- **One pastel, many colorways.** The whole system is driven by a single hue. Every accent token is `oklch(L C hue)` with fixed lightness and chroma, so lavender, mint, peach and sky feel like one family. The app themes itself from the colour of the user's band.
- **Outlined, never floating.** Every control, card and pastel shape has a 2px `line` outline. Pastel never touches cream without an edge.
- **Things press.** Elevation is a hard shadow down-right (`elev-1` to `elev-3`). Buttons lift on hover and sink into their shadow when pressed.
- **Calm data, loud packaging.** Data screens are quiet: one ring, a few stats, no pattern. The checker, scattered sparkles and pixel display type belong on the box, the site and onboarding.
- **Earned sparkle.** The Sparkle means achievement. In the app it appears only when something is earned.

## Content fundamentals

- **Voice:** a friendly coach, not a drill sergeant. Second person ("you"), present tense, short sentences. Celebrate plainly; never shame. A slower week is information, not failure.
- **Casing:** sentence case for titles and body. UPPERCASE mono only for `label` style (buttons, tabs, window titles, field labels).
- **Numbers first.** Lead with the figure, then context: "58 bpm, 3 lower than last week". Use tabular figures (the `metric` and mono styles) for anything that updates.
- **Alerts** say what happened and what to do: "Band battery at 10%. Charge for 20 minutes to keep tonight's sleep tracking."
- **Brackets** (`[ SYNC NOW ]`) are a marketing and onboarding flourish for primary CTAs. Not inside data screens.
- No emoji in product UI. The Sparkle is the brand's only celebratory glyph.

## Colour

The palette is two fixed neutrals plus one hue-driven accent family. Pick the colorway theme that matches the band (Lavender, Mint, Peach, Sky; each has Light and Dark).

| Token | Role |
| --- | --- |
| `bg` | Page ground: cream `#f8f0e3` light, charcoal `#262428` dark. Never tinted. |
| `surface` / `surface-sunken` | Windows and cards / wells, tracks, title bars, disabled fills. |
| `ink`, `line` | Text, outlines and icons. `line` is an alias of `ink`. |
| `ink-muted` | Secondary text on `bg` and `surface`. |
| `accent` | The pastel. **Fills only**: primary buttons, selected chips and tabs, progress arcs, the checker. |
| `accent-soft` | Hover washes, tags, info alerts. |
| `accent-strong` | The pastel's readable shade: links, accent icons, the focus ring. |
| `on-accent` | Dark ink on any pastel fill, in every theme. |
| `danger`, `danger-soft`, `success`, `warning` | Status. Always paired with an icon and a word. |

Rules:

- Never set text or a thin icon in `accent` on `bg` or `surface`: pastels fail contrast (around 1.5:1). Use `accent-strong` for coloured text and `on-accent` for text on a pastel fill.
- The colorway formula is `accent = oklch(0.82 0.09 h)`, `accent-soft = oklch(0.93 0.04 h)`, `accent-strong = oklch(0.46 0.13 h)` (dark themes: `0.80 / 0.36 / 0.86` lightness). Any new colorway is one new hue; check it with the Colorways page.
- Launch hues: Lavender 300, Mint 160, Peach 55, Sky 235. Set the final hex by eye against the physical strap swatches, then record the hue.
- `success` is a blue-teal so it never depends on red-versus-green against `danger`.
- Every text pair in every theme meets 4.5:1; outlines and the focus ring meet 3:1. `ink-disabled` is deliberately lower and only for disabled labels.

## Type

Three families, all on Google Fonts:

- **Pixelify Sans** (`display`): `h1`, `h2`. Uppercase heroes on the site, box and onboarding. Not in data screens.
- **DM Sans** (`sans`): `h3`, `body`, `body-sm`. All running text in the app.
- **DM Mono** (`mono`): `metric` for the one big number, `label` for buttons, tabs and window titles (uppercase, +0.06em), `caption` for units and timestamps.

Set at most one `metric` per card. Pair numbers with a `caption`-sized unit in `ink-muted`.

## Space, shape and elevation

- Spacing steps: `space-1` 4, `space-2` 8, `space-4` 16, `space-6` 24, `space-8` 32, `space-12` 48. Card padding `space-4`, gaps between cards `space-6`.
- Corners: `radius-1` (4px) on almost everything; `radius-0` where tabs meet; `radius-pill` for chips and toggles; `radius-2`/`radius-3` only for large marketing surfaces.
- Outlines: `stroke-2` everywhere; `stroke-3` for the focus ring; `stroke-1` for dashed dividers in `line-subtle`.
- Shadows: `elev-1` chips and toggles, `elev-2` buttons and inputs, `elev-3` hover and menus. Always offset down-right, no blur, black in dark themes.

## Shading

Tone and depth come from the checkerboard at pixel scale, never from gradients, blur or opacity. One 2px cell (`dither-cell`), three densities (`.gl-shade-25`, `.gl-shade-50`, `.gl-shade-75`), inked in `shade` unless `--gl-shade` says otherwise.

- Panels (Card, Alert, Stat) cast a 50% `shade` dither at the `elev-2` offset, `elev-3` when they float. Small controls keep solid shadows.
- Hover on ghost buttons, tabs and chips is a 50% `shade-accent` dither over `surface`.
- Tracks (progress ring, slider, off toggle) are 50% `line-subtle` over `surface`; disabled controls the same over `surface-sunken`.
- Never set body text on a dither. On marketing pages the cell may grow to 3px.

## States

Hover lifts 1px and grows the shadow to `elev-3` (or washes a 50% `shade-accent` dither on ghost buttons, tabs and chips). Pressed translates into the shadow. Focus is a solid 3px `focus-ring` outline 2px outside the control. Selected fills `accent`. Disabled uses `surface-sunken`, the dither and `ink-disabled`, with no shadow.

## Motion

Motion follows the same rules as everything else: light from the top-left, hard shadows, checker shading. It happens in the empty space around content, not to the content.

- **Press, lift, dissolve.** Controls press down-right into their shadow (`dur-press`, 80ms). Windows and menus lift up-left out of their shadow as they open (`.gl-lift-in`) and sink back as they close (`.gl-sink-out`). Anything appearing or disappearing steps through the checker, 25 → 50 → 75 → 100% (`.gl-dissolve-in` / `-out`). No opacity fades, no blur, no zoom.
- **Arrive slow, leave fast:** `ease-out` at `dur-base` (200ms) in, `ease-in` at `dur-quick` (120ms) out.
- **Data stays calm.** Rings and sliders glide (`dur-slow`, no overshoot). Numbers swap in place; nothing counts up.
- **The glint is earned.** `Glint.Twinkle` is the animated Sparkle: it pops with overshoot, stretches its vertical rays, flashes a thin ring, turns and collapses (`dur-glint`, 900ms). `Glint.GlintFx` adds a dithered `sheen` band sweeping the surface first. Use it for goals, streaks, pairing and purchase: once per event, one at a time. Fire the band's celebrate haptic together with it; the peak lands at about 200ms.
- **Pixel motion is stepped:** the pixel twinkle and the CheckerWipe run at 12fps (`frame-pixel`, `ease-step`). Vector UI is smooth at 60fps.
- **Screens:** in the app, dissolve. Onboarding, the site and splash may use `Glint.CheckerWipe`.
- **Reduced motion:** transitions become instant, the sheen is skipped, and the twinkle shows one still frame.

## Pattern and sparkle

- **Sparkle** (`assets/Brand/sparkle.svg`, `Glint.Sparkle`): the brand mark until the wordmark exists. Solid in `ink` or `accent-strong`; outlined when it sits in `accent` on a light ground.
- **Warp check** (`Glint.WarpCheck`, `assets/Patterns/warp-check-tile.svg`): a seamless, generated two-tone checker with occasional sparkles cut into accent cells. For packaging, tissue, the site hero, splash and onboarding. Never behind data.
- **Monogram repeat** (`assets/Patterns/monogram-tile.svg`): sparkles alternating with round medallions on a 36-unit diagonal grid. This is the emboss and deboss pattern for the strap, the box liner and the charger. The medallion is the slot for the brand initials once the name is final.

## Iconography

Use `Glint.Icon`: a house set on a 24px grid with 2px square-capped strokes in `currentColor`. `warning` is the one filled icon. No emoji, no third-party icon sets mixed in; draw new icons in the same style.

## Layout

The app is single-column on phones: one ProgressRing at the top of home, Stats in rows of two to four, Cards stacked `space-6` apart. On the site, windows may overlap and connect with 2px `line` leader lines, like the reference guides, but keep body text widths under 640px.
