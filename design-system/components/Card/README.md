# Card

The window: every grouped piece of content sits in one. A `surface` body in a 2px `line` frame at `radius-1`, casting a 50% `shade` dither shadow at the `elev-2` offset, with an optional title bar (`title`) in `surface-sunken`, or in `accent` when `accent` is set (use that for the one card a screen is about).

- The title bar takes a `lead` icon, `actions` (small buttons) and either `onClose` (a × button) or, by default, two decorative dots.
- Body helpers in bundle.css: `.gl-profile`, `.gl-avatar`, `.gl-dl` (a label/value list), and the `metric` text style for the one big number.
- `elevation={3}` for cards that float above others (menus, dialogs).
