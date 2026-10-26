# Shading

The checkerboard at pixel scale: a 2px checker (`dither-cell`, repeating every `dither-tile`) used wherever the UI needs depth or tone, instead of gradients, blur or opacity.

- **Densities:** `.gl-shade-25` (sparse), `.gl-shade-50` (checker), `.gl-shade-75` (dense). Set `--gl-shade` to change the ink; it defaults to `shade`.
- **Panel shadows:** Cards, windows, alerts and Stat tiles cast a 50% `shade` dither at the `elev-2` offset (`elev-3` for alerts and `elevation={3}`). Small controls (buttons, inputs, chips, toggles) keep solid shadows; at 2 to 4px a dither just reads as noise.
- **Hover:** ghost buttons, tabs and toggle chips wash with a 50% `shade-accent` dither over `surface` (`accent` in light themes, `accent-soft` in dark).
- **Tracks:** unfilled progress rings, sliders and off toggles are 50% `line-subtle` over `surface`.
- **Disabled:** 50% `line-subtle` over `surface-sunken` with `ink-disabled` text.
- Never put body text on a dither. Labels on a 50% accent dither are fine (ink holds above 7:1 on both cells).
- On marketing pages scale the cell to 3px so it reads as texture from a distance; never scale it on product screens.
