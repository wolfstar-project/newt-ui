---
"newtui": minor
---

`add` and `diff` now warn when a component uses a theme name your project does not declare. Before, a class such as `shadow-elevation-high` or `duration-fast` produced no CSS, and nothing said so. The CLI reads your stylesheet and the files it imports by a relative path. It lists each missing name and prints the block to paste: `@theme` entries on Tailwind v4, `theme.extend` entries on v3, and the raw `--newt-*` variables on both.

The new `newtui tokens` command appends that block for you. It adds only the missing names, so a second run writes nothing. Pass component names to limit it to what they use, and `--dry-run` to print the block without writing it. On Tailwind v3 it prints the `tailwind.config` entries instead of editing the file.

The theme now maps `duration-fast` and `duration-base` on Tailwind v4 through `--transition-duration-fast` and `--transition-duration-base`. Earlier `init` runs did not write them, so these classes had no effect on v4. Run `npx newtui tokens` to add them. On Tailwind v3 the preset now reads `var(--newt-duration-fast)` and `var(--newt-duration-base)` instead of fixed values.
