---
"newtui": minor
---

`newtui init` no longer restyles the app it is added to, and its light theme now applies.

- The stylesheet gets one complete light `:root`, and the dark values go under a selector you choose with `--dark-selector`: `class` (`.dark`, the default), `data-theme` (`[data-theme="dark"]`), `media` (the system preference) or any selector. The choice is saved as `tailwind.darkSelector` in `components.json`, and the printed Tailwind v3 preset sets `darkMode` to match. Before this, two `:root` blocks were written and the dark one won on every page.
- The `@theme` block maps only `newt` names. It no longer redefines `--radius-sm/md/lg/full`, `--font-sans` or `--font-mono`, so an existing app keeps its own radii and fonts. Components now use Tailwind's own `rounded-*` and `font-*` scale; the raw `--newt-radius-*` and `--newt-font-*` variables are still written.
- When `--css` names a new token file and another stylesheet already loads Tailwind, `init` leaves `@import "tailwindcss"` out and prints the line to import the token file from that entry.
