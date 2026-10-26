# Motion

Motion follows the same rules as the static system: light from the top-left, hard shadows, checker shading. It plays in the negative space around content, never on the content itself.

- **Press, lift, dissolve.** Controls press down-right into their shadow (`dur-press`). Windows and menus lift up-left out of it as they open (`.gl-lift-in`) and sink back into it as they close (`.gl-sink-out`). Things appear and disappear by stepping through the checker (`.gl-dissolve-in` / `-out`): no opacity fades, no blur, no scale-from-zero on panels.
- **Arrive slow, leave fast.** Entering uses `ease-out` at `dur-base`; leaving uses `ease-in` at `dur-quick`.
- **Data stays calm.** Rings and sliders glide (`dur-slow`, `ease-out`, no overshoot). Numbers swap in place with tabular figures and never count up like slot machines. Text never animates letter by letter.
- **Overshoot is earned.** `ease-pop` and the glint (Twinkle, GlintFx) are reserved for achievements, the same rule as the Sparkle.
- **Pixel motion is stepped.** Pixel-art elements (the pixel twinkle, the checker wipe) move in visible frames: 12fps, `ease-step`. Vector UI runs smooth at 60fps.
- **Screens:** in the app, dissolve (`dur-base`). Onboarding, the site and the splash screen may use the CheckerWipe.
- **Reduced motion:** every transition collapses to an instant swap, the sheen is skipped, and the twinkle shows a single static frame.
