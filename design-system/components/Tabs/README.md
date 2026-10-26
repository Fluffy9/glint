# Tabs

A joined segmented bar for switching views of the same data (Day / Week / Month) or account sections. The selected tab fills with `accent`; the rest stay `ink-muted` on `surface` and wash `accent-soft` on hover. Square inner corners (`radius-0`), the outer frame `radius-1`.

Provide `items` (`{id, label}`), and `value` + `onChange` to control it, or `defaultValue`. Arrow keys move between tabs. `brackets` wraps the active label (`[ OVERVIEW ]`) for marketing and settings pages. Keep to five tabs or fewer.
