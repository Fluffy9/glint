# Chip

Pill-shaped filters and tags (`radius-pill`, `elev-1`). Three looks: **outline** (`surface`, the default), **soft** (`accent-soft`, for tags the user didn't choose, like auto-detected activity types) and **selected** (`accent` with `on-accent`).

- Toggle chips: pass `selected` and `onClick`; they render as `aria-pressed` buttons.
- Removable chips: pass `onRemove`; the × is its own button with an accessible name.
- Sentence case, one or two words.
