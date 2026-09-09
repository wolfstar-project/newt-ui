---
"newtui": minor
---

Presets: a project's brand hue, radius scale, font stack, surface mode and direction can now be chosen once in newt/create and handed to the CLI as a code.

A preset code is `nt1.<base64url>` over a versioned payload, and it is a set of overrides for tokens that already exist — never a second theme file. `newtui init --preset nt1.…` writes the block into the global stylesheet after the tokens it overrides, fenced by two comments so it can be found again; `newtui apply --preset nt1.…` does that step alone, for a project that ran `init` some time ago, replacing an existing block instead of stacking a second one that would silently win.

`newtui init --template <next|vite-react|vite-vue|nuxt>` creates the project first, by running the creator that framework maintains, then continues with the usual `init` inside the result. The other targets the docs cover — Astro, TanStack Start, React Router, Laravel — are created with their own tool and `init` runs afterwards; a preset still records which one you were aiming at, it just does not imply a template.

`newtui preset decode <code>` prints what a code carries, with `encode` and `css` for the other two directions. The codec is pinned by a golden fixture shared with the documentation site, so the builder and the CLI cannot drift apart.
