---
"newtui": patch
---

`init` and `add` now resolve a Nuxt project's write paths under `app/` when the project uses Nuxt 4's source root, instead of always guessing `src/` or the project root.

Detection checks, in order: an explicit `srcDir` in the target's `nuxt.config`, what already exists on disk (`app/` wins over `src/`), then — for a brand-new project with neither directory yet — the installed (or opted-in, via `future.compatibilityVersion: 4`) Nuxt major. A plain Nuxt 3 project keeps resolving at the root, as before. `DEFAULT_TAILWIND_CSS` is now keyed by bundler (`nuxt`/`vite`) instead of framework, so a fresh Vite Vue project with no existing stylesheet no longer falls back to a Nuxt-shaped default path.
