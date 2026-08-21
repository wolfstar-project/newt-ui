# Setup guides

Choose the guide that matches your project:

| Guide                                              | When to use                                                       |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| [**HTML & CSS**](./html.md)                        | Static sites, bot landing pages, quick prototypes — no build step |
| [**React**](./react.md)                            | React + Vite, Create React App, or any React SPA                  |
| [**Next.js**](./nextjs.md)                         | Next.js 13+ App Router or Next.js 12 Pages Router                 |
| [**Vue & Nuxt**](./vue.md)                         | Vue 3 + Vite, or Nuxt 3                                           |
| [**newt-dsl & newt-trace**](./newt-integration.md) | Wiring newt-trace events and newt-dsl commands into components    |

---

## Quick reference

### Install tokens + components

```bash
npx @newt-devs/ui@latest init
npx @newt-devs/ui@latest add <component> [<component> ...]
npx @newt-devs/ui@latest list   # see everything available
```

### CDN (no install)

```html
<!-- Works immediately after pushing to GitHub -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/newt-devs/newt-ui@main/registry/tokens.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/newt-devs/newt-ui@main/registry/components/button.css"
/>
```

### Always required

Whatever framework you use, two things are always needed:

1. **Tokens CSS** loaded before any component stylesheet
2. **`newt-root` class** on the root element for base font/color resets

```html
<!-- tokens first -->
<link rel="stylesheet" href="styles/newt-tokens.css" />

<!-- newt-root on root element -->
<body class="newt-root">
  ...
</body>
```

---

## Component dependency resolution

The CLI automatically installs dependencies — e.g. adding `status-indicator`
pulls in `avatar`, and `member-list` pulls in both. You don't need to track
these manually.

If you're loading via CDN, check `registry.json` at the repo root for the
`uses` field on each component to know which CSS files to include.

---

## Customising the token palette

All colors, radii, and spacing values are CSS variables defined in
`tokens.css`. Override any of them in your own stylesheet after importing:

```css
:root {
  --newt-brand: #17a589; /* change the primary accent */
  --newt-bg-base: #18191c; /* slightly darker base */
  --newt-radius-md: 4px; /* flatten the rounding */
}
```

---

## Discord trademark notice

newt/ui is not affiliated with Discord Inc. See
[`DISCLAIMER.md`](../../DISCLAIMER.md) for the full notice.
