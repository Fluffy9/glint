# Alert

A window that interrupts: `elev-3`, title bar plus an icon, a one-line `title` and a short body. Tones:

- **warning**: the `warning` triangle with an `on-accent` glyph. Battery, connectivity, things that will go wrong.
- **danger**: body on `danger-soft`, title in `danger`, same triangle; announced with `role="alert"`. Things that already went wrong.
- **info**: body on `accent-soft`, `accent-strong` info icon.
- **success**: `success` check. Prefer the Sparkle celebration for goals; use this for confirmations.

Props: `tone`, `title`, children (body text), `barTitle` (defaults to Heads up / Error / Note / Done), `onClose`, `actions`. Every alert says what happened and what to do next; never just "Error".
