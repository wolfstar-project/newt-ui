# Setup — Plain HTML & CSS

The simplest way to use newt/ui. No build step, no framework, no bundler.
Works for static sites, Discord bot landing pages, and quick prototypes.

---

## Option A — CLI (recommended)

The CLI copies only the components you need directly into your project, so
there's no unused CSS and you own every file.

**1. Install**

```bash
npx @wolfstar/newt-ui-html init
```

This creates `newt-ui.json` (config) and copies `registry/tokens.css` into
`styles/newt-tokens.css` (or wherever you configured).

**2. Add components**

```bash
npx @wolfstar/newt-ui-html add button embed status-indicator
```

Components land in `components/ui/` by default. Each is a `.css` file (and
optionally `.html` + `.js`) that you copy-paste markup from.

**3. Wire into your HTML**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Bot Dashboard</title>

    <!-- 1. Tokens first — every component depends on these CSS variables -->
    <link rel="stylesheet" href="styles/newt-tokens.css" />

    <!-- 2. Only the components you added -->
    <link rel="stylesheet" href="components/ui/button.css" />
    <link rel="stylesheet" href="components/ui/embed.css" />
    <link rel="stylesheet" href="components/ui/status-indicator.css" />
    <link rel="stylesheet" href="components/ui/avatar.css" />
  </head>
  <body class="newt-root">
    <!-- Use .newt-root on body for base font/color resets -->

    <button class="newt-btn newt-btn--primary">Deploy</button>

    <div class="newt-embed">
      <div class="newt-embed__body">
        <div class="newt-embed__eyebrow">newt-trace · shard 2</div>
        <div class="newt-embed__title">Command latency spike</div>
        <div class="newt-embed__description">p95 exceeded 800ms for /play</div>
      </div>
    </div>
  </body>
</html>
```

**4. See all available components**

```bash
npx @wolfstar/newt-ui-html list
```

---

## Option B — CDN (jsDelivr, no install)

Load the token file and individual component stylesheets straight from the CDN.
Pin to a version tag in production.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- Works immediately after pushing to GitHub -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/wolfstar-project/newt-ui@main/registry/tokens.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/wolfstar-project/newt-ui@main/registry/components/button.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/wolfstar-project/newt-ui@main/registry/components/embed.css"
    />
  </head>
  <body class="newt-root">
    <button class="newt-btn newt-btn--primary">Deploy</button>
  </body>
</html>
```

Or pin to a release tag (after `npm publish`):

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@wolfstar/newt-ui@0.1.0/registry/tokens.css"
/>
```

> **Tip:** for production, pin to a git tag (`@v0.1.0`) rather than `@main` —
> `@main` always reflects the latest commit and can change without notice.

---

## Option C — Download the CSS directly

Download `registry/tokens.css` and whichever `registry/components/*.css` files
you need from the [GitHub repo](https://github.com/wolfstar-project/newt-ui), drop
them into your project, and link them as normal stylesheets. No CLI, no CDN
dependency.

---

## Customising tokens

All design values live in CSS variables in `tokens.css`. Override any of them
on `:root` in your own stylesheet — no need to edit the token file itself.

```css
/* my-overrides.css — load AFTER tokens.css */
:root {
  /* Shift the brand color to teal */
  --newt-brand: #17a589;

  /* Lighten the base background slightly */
  --newt-bg-base: #1a1b1e;
}
```

---

## Adding JavaScript behaviour

Some components (tabs, modal, token field) have optional vanilla JS files in
`registry/components/`. Either:

- Link the `.js` file directly: `<script src="components/ui/tabs.js" type="module"></script>`
- Or copy the JS into your own script — it's plain DOM manipulation, no
  framework required.

---

## Applying the Discord-style scrollbar globally

Add `.newt-scrollbar` to any scrollable container, or apply the global
scrollbar styles from `registry/components/scrollbar.css` to your `body`:

```css
/* In your own CSS, after importing the component */
html,
body {
  scrollbar-width: thin;
  scrollbar-color: var(--newt-bg-active) transparent;
}
```
