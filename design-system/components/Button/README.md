# Button

Outlined, hard-shadowed actions that physically press. Use **primary** (an `accent` fill with `on-accent` label) once per view for the thing the screen is for; **secondary** (`surface`) for everything else; **ghost** for skip and cancel; **danger** only to unpair, delete or reset.

- Labels are `label` style: DM Mono, uppercase, verb first ("Sync now", "Start workout"). Set `brackets` (`[ SYNC NOW ]`) on marketing pages, onboarding and the hero CTA; leave it off inside data screens.
- Rest at `elev-2`; hover lifts 1px to `elev-3`; pressed drops into its shadow (translate 4px, no shadow). Disabled swaps to `surface-sunken` with the micro-checker dither and `ink-disabled`.
- Icon-only buttons need `label` for the accessible name.

Props: `variant` primary | secondary | ghost | danger, `size` md | sm, `icon` (an Icon name), `brackets`, plus any `<button>` attribute.
