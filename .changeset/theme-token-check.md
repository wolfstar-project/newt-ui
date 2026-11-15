---
"newtui": minor
---

`add` and `diff` now warn when a component uses a theme name your project does not declare. Before, a class such as `shadow-elevation-high` or `duration-fast` produced no CSS, and nothing said so. The CLI reads your stylesheet and the files it imports by a relative path. It lists each missing name and prints the block to paste: `@theme` entries on Tailwind v4, `theme.extend` entries on v3, and the raw `--newt-*` variables on both.

The new `newtui tokens` command appends that block for you. It adds only the missing names, so a second run writes nothing. Pass component names to limit it to what they use, and `--dry-run` to print the block without writing it. On Tailwind v3 it prints the `tailwind.config` entries instead of editing the file.

The theme now maps `duration-fast` and `duration-base` on Tailwind v4 through `--transition-duration-fast` and `--transition-duration-base`. Earlier `init` runs did not write them, so these classes had no effect on v4. Run `npx newtui tokens` to add them. On Tailwind v3 the preset now reads `var(--newt-duration-fast)` and `var(--newt-duration-base)` instead of fixed values.

Components now read their radii and their sans and mono stacks from the newt tokens, not from your Tailwind scale. `rounded-md` became `rounded-[var(--newt-radius-md)]`, and `font-sans` became `font-[family-name:var(--newt-font-sans)]`; the same holds for `sm`, `lg`, the sided radii and `font-mono`. Before, a host with its own scale restyled them: in an app with Nuxt UI `rounded-md` is 12px, not 8px. Tailwind v3 compiled the default 6px. Both forms compile on Tailwind v3 and v4, and a `rounded-*` or `font-*` class you pass still wins. A newt/create preset's radius and font now reach the components too. Run `npx newtui add <component> --overwrite` to update installed components. To keep your own scale inside newt/ui, set `--newt-radius-*` and `--newt-font-*` to it, as the theming guide shows.
