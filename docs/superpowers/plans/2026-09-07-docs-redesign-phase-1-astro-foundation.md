# Docs redesign — Phase 1: Astro foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite SPA in `apps/docs` with an Astro static site that has the shadcn docs layout (header, sidebar, TOC, pager, search, copy-page), MDX content collections, one MDX page per component rendering React and Vue demos, theme and framework toggles, `.md` twins and `llms.txt`, while keeping the `/r/**` registry deployment contract.

**Architecture:** Astro 7 static output. Content in `src/content/docs/**/*.mdx` (collection `docs`). Component pages are thin MDX files whose chrome comes from Astro components that read `apps/www/registry/meta/*.json`. Demos are two sibling islands per preview (`client:only="react"`, `client:only="vue"`) gated by a nanostore. Framework-dependent server markup is rendered twice and toggled with a `data-framework` attribute on `<html>`.

**Tech Stack:** astro 7.3, @astrojs/mdx 8, @astrojs/react 6, @astrojs/vue 7, @astrojs/sitemap 3.7, @tailwindcss/vite 4.3, tailwindcss 4.3, astro-expressive-code 0.44, astro-pagefind 2.0, nanostores 1.5, @nanostores/react 2.0, @nanostores/vue 1.1, react 19, vue 3.5, tw-animate-css 1.4, cn 0.2.

**Spec:** `docs/superpowers/specs/2026-09-07-docs-redesign-design.md`

## Global Constraints

- Node `>=22.11`, pnpm 11. Package manager settings live in `pnpm-workspace.yaml`, never `.npmrc`.
- `typescript` is overridden to `typescript-native-bridge`: `tsconfig.json` must not set `baseUrl`; `paths` alone resolves relative to the tsconfig.
- Format/lint with `oxfmt`/`oxlint` only, `maxWarnings: 0`. Fix warnings, do not suppress.
- `apps/docs` must never import from `packages/*` source; it reads `apps/www/registry` and `apps/vue/app/lib/registry` through the three aliases `@/registry`, `@/lib/registry`, `@/lib/utils`.
- `apps/docs/dist` must contain `r/**`, `vue/r/**` and `404.html` after `pnpm build` (registry CDN contract, `https://newtui.dev/r`).
- Never hardcode a hex value that exists as a `--newt-*` token. Site chrome uses `bg-newt-*`, `text-newt-*` utilities from the token bridge in `site.css`.
- All copy: "Discord-inspired", never "Discord components"; no Discord wordmarks or assets (`DISCLAIMER.md`).
- Vite resolves `import.meta.glob` before aliases: glob patterns must be relative paths (`../../../www/registry/...`), as in the current code.
- Commit after every task with a conventional message. Work on branch `feat/docs-astro-foundation`.

---

## File structure (end state of `apps/docs`)

| Path                                                                  | Responsibility                                           |
| --------------------------------------------------------------------- | -------------------------------------------------------- |
| `package.json`, `astro.config.ts`, `tsconfig.json`                    | project config                                           |
| `scripts/bundle-registry.mjs`                                         | kept; copies both registries into `dist/`                |
| `scripts/gen-component-docs.mjs`                                      | creates missing `src/content/docs/components/<name>.mdx` |
| `scripts/verify-dist.mjs`                                             | asserts the deployment contract after build (the "test") |
| `src/content.config.ts`                                               | `docs` and `changelog` collections                       |
| `src/content/docs/index.mdx`, `installation.mdx`, `using-with-ai.mdx` | ported pages                                             |
| `src/content/docs/components/<name>.mdx` × 55                         | component pages                                          |
| `src/content/changelog/.gitkeep`                                      | empty collection, filled in phase 2                      |
| `src/stores/framework.ts`, `src/stores/theme.ts`                      | persisted nanostores                                     |
| `src/lib/registry.ts`                                                 | meta, categories, demo loaders, raw sources              |
| `src/lib/nav.ts`                                                      | sidebar tree + `neighbours()`                            |
| `src/lib/site.ts`                                                     | `SITE` constant (moved from `src/content/site.ts`)       |
| `src/layouts/Base.astro`                                              | `<html>`, head, inline pre-paint script, header, footer  |
| `src/layouts/Docs.astro`                                              | sidebar + article + TOC + pager                          |
| `src/components/site/*.astro`, `FrameworkSwitcher.tsx`                | chrome                                                   |
| `src/components/mdx/*.astro`                                          | MDX building blocks                                      |
| `src/components/demo/ReactDemo.tsx`, `VueDemo.vue`                    | demo islands                                             |
| `src/pages/**`                                                        | routes (see spec §5)                                     |
| `src/styles/site.css`                                                 | token bridge + chrome                                    |

Deleted: `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/site/**`, `src/pages/*.tsx`, `src/content/*.ts`, `src/vue/demos.ts`.

---

### Task 1: Spike — React and Vue islands in one Astro page

**Files:**

- Create: `/tmp/astro-spike` (throwaway, outside the repo)

- [ ] **Step 1: Scaffold**

```bash
cd /tmp && pnpm create astro@latest astro-spike --template minimal --no-install --no-git --skip-houston --typescript strict
cd astro-spike && pnpm add astro@^7.3 @astrojs/react@^6 @astrojs/vue@^7 @astrojs/mdx@^8 react@^19 react-dom@^19 vue@^3.5 nanostores @nanostores/react @nanostores/vue
```

- [ ] **Step 2: Config + one page with both islands sharing a store**

`astro.config.mjs`:

```js
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import vue from "@astrojs/vue"
import mdx from "@astrojs/mdx"
export default defineConfig({ integrations: [react(), vue(), mdx()] })
```

`src/store.ts`: `import { atom } from "nanostores"; export const $fw = atom<"react"|"vue">("react")`
`src/R.tsx`: `import { useStore } from "@nanostores/react"; import { $fw } from "./store"; export default function R(){ const fw = useStore($fw); return fw==="react" ? <button onClick={()=>$fw.set("vue")}>react → vue</button> : null }`
`src/V.vue`: `<script setup lang="ts">import { useStore } from "@nanostores/vue"; import { $fw } from "./store"; const fw = useStore($fw)</script><template><button v-if="fw==='vue'" @click="$fw.set('react')">vue → react</button></template>`
`src/pages/index.astro`: `---import R from "../R"; import V from "../V.vue"---<R client:only="react" /><V client:only="vue" />`

- [ ] **Step 3: Verify**

Run: `pnpm astro build && pnpm astro preview` and click the button twice.
Expected: the button alternates between the React and Vue island with no console errors. If `@nanostores/vue` and `@nanostores/react` share the atom correctly, the approach in the spec is confirmed. Note the exact `astro`, `@astrojs/react`, `@astrojs/vue` versions installed; use them in Task 2.

- [ ] **Step 4: Discard** — `rm -rf /tmp/astro-spike`. Nothing is committed.

---

### Task 2: New `apps/docs` skeleton (config, deps, styles moved)

**Files:**

- Modify: `apps/docs/package.json`
- Create: `apps/docs/astro.config.ts`
- Modify: `apps/docs/tsconfig.json`
- Move: `apps/docs/src/styles/site.css` (kept, edited later)
- Create: `apps/docs/src/lib/utils.ts` (move from `src/lib/utils.ts` — same content)
- Delete: `apps/docs/index.html`, `apps/docs/vite.config.ts`

**Interfaces:**

- Produces: aliases `@/registry`, `@/lib/registry`, `@/lib/utils` usable in `.astro`, `.tsx`, `.vue`, `.mdx`.

- [ ] **Step 1: Rewrite `apps/docs/package.json`**

```json
{
  "name": "docs",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "astro build && node scripts/bundle-registry.mjs && node scripts/verify-dist.mjs",
    "dev": "astro dev",
    "docs:gen": "node scripts/gen-component-docs.mjs",
    "lint": "oxlint -c ../../.oxlintrc.json .",
    "lint:fix": "oxlint -c ../../.oxlintrc.json --fix .",
    "preview": "astro preview",
    "typecheck": "astro check"
  },
  "dependencies": {
    "@astrojs/mdx": "^8.0.0",
    "@astrojs/react": "^6.0.5",
    "@astrojs/sitemap": "^3.7.4",
    "@astrojs/vue": "^7.0.2",
    "@nanostores/react": "^2.0.1",
    "@nanostores/vue": "^1.1.0",
    "astro": "^7.3.1",
    "astro-expressive-code": "^0.44.2",
    "astro-pagefind": "^2.0.1",
    "cn": "^0.2.4",
    "nanostores": "^1.5.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.6",
    "@tailwindcss/vite": "^4.3.3",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "tailwindcss": "^4.3.3",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5.7.2"
  }
}
```

Then `pnpm install` from the repo root. If `@astrojs/check` is not the current name for the `astro check` dependency, use what `pnpm astro check` reports as missing.

- [ ] **Step 2: Create `apps/docs/astro.config.ts`**

```ts
import { fileURLToPath } from "node:url"

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import vue from "@astrojs/vue"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import expressiveCode from "astro-expressive-code"
import pagefind from "astro-pagefind"

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  site: "https://newtui.dev",
  output: "static",
  trailingSlash: "never",
  build: { format: "directory" },
  integrations: [
    // expressiveCode must precede mdx so fenced blocks get frames + copy buttons.
    expressiveCode({
      themes: ["github-dark", "github-light"],
      themeCssSelector: (theme) =>
        theme.type === "dark"
          ? ":root:not([data-newt-theme='light'])"
          : "[data-newt-theme='light']",
      styleOverrides: {
        borderRadius: "var(--newt-radius-md)",
        codeFontFamily: "var(--newt-font-mono)",
      },
    }),
    mdx(),
    react(),
    vue(),
    pagefind(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Longest prefix first: `@/lib/registry` must win over `@/lib/utils`.
      alias: [
        {
          find: "@/lib/registry",
          replacement: here("../vue/app/lib/registry"),
        },
        { find: "@/lib/utils", replacement: here("./src/lib/utils.ts") },
        { find: "@/registry", replacement: here("../www/registry") },
      ],
    },
  },
})
```

- [ ] **Step 3: Rewrite `apps/docs/tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "paths": {
      "@/lib/registry/*": ["../vue/app/lib/registry/*"],
      "@/lib/utils": ["./src/lib/utils.ts"],
      "@/registry/*": ["../www/registry/*"]
    }
  },
  "include": [
    ".astro/types.d.ts",
    "src/**/*",
    "scripts/**/*",
    "../www/registry/**/*",
    "../vue/app/lib/registry/**/*"
  ],
  "exclude": ["dist"]
}
```

No `baseUrl` (forbidden by the `typescript-native-bridge` override).

- [ ] **Step 4: Delete the Vite entry points**

```bash
git rm apps/docs/index.html apps/docs/vite.config.ts apps/docs/src/main.tsx
```

- [ ] **Step 5: Smoke**

Create a temporary `apps/docs/src/pages/index.astro` containing `<h1>newt/ui</h1>` and run `pnpm --filter docs exec astro build`.
Expected: `apps/docs/dist/index.html` exists. (`bundle-registry.mjs` will fail until registries are built; run `pnpm --filter www registry:build && pnpm --filter vue-www registry:build` first, or use `astro build` directly for this step.)

- [ ] **Step 6: Commit** — `git commit -m "feat(docs): scaffold Astro project replacing the Vite SPA"`

---

### Task 3: Persisted stores and pre-paint script

**Files:**

- Create: `apps/docs/src/stores/framework.ts`, `apps/docs/src/stores/theme.ts`
- Create: `apps/docs/src/layouts/Base.astro`

**Interfaces:**

- Produces: `$framework: WritableAtom<"react"|"vue">`, `FRAMEWORKS`, `type Framework`; `$theme: WritableAtom<"dark"|"light">`. Both persist to `localStorage` keys `newt-ui:framework`, `newt-ui:theme` and mirror to `document.documentElement.dataset.framework` / `.dataset.newtTheme`.

- [ ] **Step 1: `src/stores/framework.ts`**

```ts
import { atom, onMount } from "nanostores"

export const FRAMEWORKS = ["react", "vue"] as const
export type Framework = (typeof FRAMEWORKS)[number]
const KEY = "newt-ui:framework"

function isFramework(value: unknown): value is Framework {
  return FRAMEWORKS.includes(value as Framework)
}

export const $framework = atom<Framework>("react")

onMount($framework, () => {
  const stored = localStorage.getItem(KEY)
  if (isFramework(stored)) $framework.set(stored)
  return $framework.subscribe((value) => {
    localStorage.setItem(KEY, value)
    document.documentElement.dataset.framework = value
  })
})
```

- [ ] **Step 2: `src/stores/theme.ts`** — same shape with `THEMES = ["dark","light"]`, key `newt-ui:theme`, default `"dark"`, and `document.documentElement.dataset.newtTheme = value` (attribute `data-newt-theme`, matching the palette selector in `site.css` and `tokens.css`). Also apply `document.documentElement.style.colorScheme = value`.

- [ ] **Step 3: `src/layouts/Base.astro`**

```astro
---
import "@/styles/site.css"  // add alias `@/styles` → `./src/styles` in astro.config + tsconfig
import Header from "../components/site/Header.astro"
import Footer from "../components/site/Footer.astro"
import { SITE } from "../lib/site"

interface Props { title: string; description?: string }
const { title, description = SITE.tagline } = Astro.props
const canonical = new URL(Astro.url.pathname, Astro.site)
---
<!doctype html>
<html lang="en" data-framework="react" data-newt-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title === SITE.name ? title : `${title} · ${SITE.name}`}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <script is:inline>
      // Runs before first paint: apply persisted theme + framework so nothing flashes.
      try {
        const t = localStorage.getItem("newt-ui:theme");
        if (t === "light" || t === "dark") { document.documentElement.dataset.newtTheme = t; document.documentElement.style.colorScheme = t; }
        const f = localStorage.getItem("newt-ui:framework");
        if (f === "react" || f === "vue") document.documentElement.dataset.framework = f;
      } catch {}
    </script>
  </head>
  <body class="min-h-dvh bg-newt-bg-base font-sans text-newt-text-primary antialiased">
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Move `SITE`** — `git mv apps/docs/src/content/site.ts apps/docs/src/lib/site.ts` (content unchanged). `src/content/` must contain only collections from now on.

- [ ] **Step 5: Commit** — `git commit -m "feat(docs): persisted framework and theme stores with pre-paint script"`

---

### Task 4: Registry access layer and nav

**Files:**

- Create: `apps/docs/src/lib/registry.ts` (port of `src/content/components.ts` + `src/vue/demos.ts` + `src/site/source.ts`)
- Create: `apps/docs/src/lib/nav.ts` (port of `src/content/nav.ts`)
- Delete: `apps/docs/src/content/components.ts`, `apps/docs/src/content/nav.ts`, `apps/docs/src/vue/demos.ts`, `apps/docs/src/site/source.ts`

**Interfaces:**

- Produces:

  ```ts
  export interface ComponentMeta {
    name
    title
    description
    dependencies: string[]
    registryDependencies: string[]
    vueFiles: string[]
    reactDemo: string
    vueDemo: string
    categorySlug: string
    categoryLabel: string
  }
  export const COMPONENTS: readonly ComponentMeta[] // category order, as today
  export function findComponent(name: string): ComponentMeta | undefined
  export const reactDemos: Record<
    string,
    () => Promise<{ default: React.ComponentType }>
  > // key: "button-demo"
  export const vueDemos: Record<string, () => Promise<{ default: Component }>> // key: "ButtonDemo"
  export function demoSource(
    framework: Framework,
    demo: string
  ): string | undefined // raw text, build-time
  export const rootClasses: Record<string, string> // re-export of registry-root-classes
  ```

  `nav.ts`: `NAV: NavGroup[]` (Get Started → categories → …), `neighbours(path)`.

- [ ] **Step 1: Write `src/lib/registry.ts`**

Copy the logic from `src/content/components.ts:12-96` (meta glob `../../../www/registry/meta/*.json` eager, category iteration from `@/registry/registry-categories`, React demo glob `../../../www/registry/default/example/*-demo.tsx` lazy), `src/vue/demos.ts:12` (Vue glob `../../../vue/app/lib/registry/default/example/*Demo.vue`), and `src/site/source.ts:8-16` (`?raw` globs, eager, both dirs). Keep relative glob paths. Note: `src/lib/` is one level deeper than `src/content/` was? No — both are `apps/docs/src/<dir>/`, so the `../../../` prefixes are unchanged.

- [ ] **Step 2: Write `src/lib/nav.ts`**

```ts
import { categories } from "@/registry/registry-categories"
import { COMPONENTS } from "./registry"

export interface NavItem {
  href: string
  label: string
  badge?: "new" | "updated"
}
export interface NavGroup {
  label: string
  items: NavItem[]
}

const GET_STARTED: NavGroup = {
  label: "Get Started",
  items: [
    { href: "/docs", label: "Introduction" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/docs/using-with-ai", label: "Using with AI" },
    { href: "/llms.txt", label: "llms.txt" },
  ],
}

export const NAV: NavGroup[] = [
  GET_STARTED,
  ...categories.map((c) => ({
    label: c.label,
    items: COMPONENTS.filter((x) => x.categorySlug === c.slug).map((x) => ({
      href: `/docs/components/${x.name}`,
      label: x.title,
    })),
  })),
]

const FLAT = NAV.flatMap((g) => g.items).filter((i) => !i.href.endsWith(".txt"))
export function neighbours(path: string) {
  const i = FLAT.findIndex((item) => item.href === path)
  return i === -1 ? {} : { previous: FLAT[i - 1], next: FLAT[i + 1] }
}
```

Phase 2 extends `GET_STARTED` and adds Design/Installation/Dark Mode/Forms/Registry groups.

- [ ] **Step 3: Verify** — `pnpm --filter docs exec astro check` passes for these two files (create a temp `src/pages/index.astro` that imports `NAV` and prints `NAV.length` if needed; expected `7`).

- [ ] **Step 4: Commit** — `git commit -m "feat(docs): registry access layer and nav for Astro"`

---

### Task 5: Content collections and MDX component pages

**Files:**

- Create: `apps/docs/src/content.config.ts`
- Create: `apps/docs/scripts/gen-component-docs.mjs`
- Create: `apps/docs/src/content/docs/components/<name>.mdx` × 55 (generated)
- Create: `apps/docs/src/content/changelog/.gitkeep`

**Interfaces:**

- Produces: collection `docs` with `id` = path without extension (`components/button`, `installation`, `index`); schema below. Collection `changelog` (empty).

- [ ] **Step 1: `src/content.config.ts`**

```ts
import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const docs = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    component: z.boolean().default(false),
    new: z.boolean().default(false),
    updated: z.boolean().default(false),
    links: z
      .object({
        doc: z.string().url().optional(),
        api: z.string().url().optional(),
      })
      .optional(),
    toc: z.boolean().default(true),
    pager: z.boolean().default(true),
  }),
})

const changelog = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/changelog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
})

export const collections = { docs, changelog }
```

- [ ] **Step 2: `scripts/gen-component-docs.mjs`**

Reads `../www/registry/meta/*.json`; for every `name` with no `src/content/docs/components/<name>.mdx`, writes:

```mdx
---
title: <title>
description: <description>
component: true
---

import {
  ComponentPreview,
  Installation,
  Usage,
  TokensNote,
} from "@/components/mdx"

<ComponentPreview name="<name>" />

## Installation

<Installation name="<name>" />

## Usage

<Usage name="<name>" />

## Tokens

<TokensNote name="<name>" />
```

Never overwrites. Prints `created N, skipped M`. Add alias `@/components` → `./src/components` in `astro.config.ts` and `tsconfig.json`.

- [ ] **Step 3: Run it** — `pnpm --filter docs docs:gen`. Expected: `created 55, skipped 0`. Re-run: `created 0, skipped 55`.

- [ ] **Step 4: Commit** — `git commit -m "feat(docs): content collections and generated component pages"`

---

### Task 6: MDX building blocks (preview, installation, usage, tokens)

**Files:**

- Create: `apps/docs/src/components/mdx/index.ts`
- Create: `apps/docs/src/components/mdx/ComponentPreview.astro`, `Installation.astro`, `Usage.astro`, `TokensNote.astro`, `Tabs.astro`, `PmTabs.astro`, `Callout.astro`, `Steps.astro`
- Create: `apps/docs/src/components/demo/ReactDemo.tsx`, `VueDemo.vue`

**Interfaces:**

- Consumes: `findComponent`, `reactDemos`, `vueDemos`, `demoSource`, `rootClasses` from `src/lib/registry.ts`; `$framework` store.
- Produces: `<ComponentPreview name demo?>` (defaults `demo` to meta `reactDemo`/`vueDemo`), `<Installation name>`, `<Usage name>`, `<TokensNote name>`, `<Tabs labels=[...]>` with `<Fragment slot="tab-0">`, `<PmTabs cmd="newtui@latest add button">`, `<Callout type="info|warning">`, `<Steps>`.

- [ ] **Step 1: Demo islands**

`ReactDemo.tsx`:

```tsx
import { useStore } from "@nanostores/react"
import { Suspense, lazy, useMemo, Component, type ReactNode } from "react"
import { reactDemos } from "@/lib/registry-client" // see note
import { $framework } from "@/stores/framework"

class Boundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state = {} as { error?: Error }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    return this.state.error ? (
      <pre className="demo-error">{this.state.error.message}</pre>
    ) : (
      this.props.children
    )
  }
}

export default function ReactDemo({ demo }: { demo: string }) {
  const fw = useStore($framework)
  const Demo = useMemo(() => lazy(reactDemos[demo]), [demo])
  if (fw !== "react") return null
  return (
    <Boundary>
      <Suspense fallback={<div className="demo-loading" />}>
        <Demo />
      </Suspense>
    </Boundary>
  )
}
```

Note: `src/lib/registry.ts` is imported by server code and includes `?raw` eager globs; islands must not pull those into the client bundle. Split: `src/lib/registry-client.ts` holds only the two lazy demo glob maps; `src/lib/registry.ts` re-exports them plus the server-only parts.

`VueDemo.vue`:

```vue
<script setup lang="ts">
import { useStore } from "@nanostores/vue"
import { defineAsyncComponent, computed } from "vue"
import { vueDemos } from "@/lib/registry-client"
import { $framework } from "@/stores/framework"
const props = defineProps<{ demo: string }>()
const fw = useStore($framework)
const Demo = computed(() => defineAsyncComponent(vueDemos[props.demo]))
</script>
<template>
  <component :is="Demo" v-if="fw === 'vue'" />
</template>
```

- [ ] **Step 2: `ComponentPreview.astro`**

```astro
---
import { Code } from "astro-expressive-code/components"
import ReactDemo from "../demo/ReactDemo"
import VueDemo from "../demo/VueDemo.vue"
import { demoSource, findComponent } from "../../lib/registry"
import Tabs from "./Tabs.astro"

interface Props { name: string; demo?: string }
const { name, demo } = Astro.props
const meta = findComponent(name)
if (!meta) throw new Error(`ComponentPreview: unknown component "${name}"`)
const reactDemo = demo ? `${demo}-demo` : meta.reactDemo
const vueDemo = demo ? `${pascal(demo)}Demo` : meta.vueDemo   // pascal() from ../../lib/strings
const reactSrc = demoSource("react", reactDemo)
const vueSrc = demoSource("vue", vueDemo)
---
<Tabs labels={["Preview", "Code"]}>
  <figure slot="tab-0" class="demo-frame newt-root">
    <ReactDemo client:only="react" demo={reactDemo} />
    <VueDemo client:only="vue" demo={vueDemo} />
  </figure>
  <div slot="tab-1">
    <div data-framework="react">{reactSrc && <Code code={reactSrc} lang="tsx" title={`${reactDemo}.tsx`} />}</div>
    <div data-framework="vue">{vueSrc && <Code code={vueSrc} lang="vue" title={`${vueDemo}.vue`} />}</div>
  </div>
</Tabs>
```

`site.css` gets: `html[data-framework="react"] [data-framework="vue"], html[data-framework="vue"] [data-framework="react"] { display: none; }`.

- [ ] **Step 3: `Installation.astro`** — CLI | Manual tabs. CLI tab: `<PmTabs cmd={`newtui@latest add ${name}`} />` rendering `pnpm dlx` / `npx` / `yarn dlx` / `bunx` variants (client-side tab state stored in `localStorage` `newt-ui:pm`, same pattern as framework). Manual tab: `<Steps>` — 1. install `meta.dependencies` (skip if none) 2. registry dependencies as links to `/docs/components/<dep>` 3. per framework (`data-framework` wrappers) the list of target paths: React `components/ui/<name>.tsx`, Vue `components/ui/<name>/<file>` for each `vueFiles` entry, with a `<Code>` block of each file's source read via `?raw` glob of `../../../www/registry/default/ui/*.tsx` and `../../../vue/app/lib/registry/default/ui/*/*.{vue,ts}` (add these two eager globs to `src/lib/registry.ts` as `uiSource(framework, path)`).

- [ ] **Step 4: `Usage.astro`** — port `ComponentPage.tsx:259-300` logic: React `import { Pascal } from "@/components/ui/<name>"`; Vue named exports from `vueFiles` minus `index.ts`, `import { A, B } from "@/components/ui/<name>"`. Both wrapped in `data-framework`.

- [ ] **Step 5: `TokensNote.astro`** — short paragraph: root class from `rootClasses[name]`, link to `/docs/installation#tokens` (phase 2 changes it to `/docs/theming`).

- [ ] **Step 6: `Tabs.astro`** — accessible tablist (`role="tablist"`, `aria-selected`, arrow-key navigation) with a `<script>` (Astro bundles it once). Slots `tab-0..n`. `PmTabs.astro` reuses it.

- [ ] **Step 7: `index.ts`** re-exports all MDX components.

- [ ] **Step 8: Verify** — temporary `src/pages/test.astro` rendering `<ComponentPreview name="button" />`, `pnpm --filter docs dev`, open `/test`: both demos toggle with `localStorage.setItem("newt-ui:framework","vue")` + reload; Code tab shows the right file. Delete `test.astro`.

- [ ] **Step 9: Commit** — `git commit -m "feat(docs): MDX preview, installation and usage blocks with dual-framework islands"`

---

### Task 7: Docs layout — header, sidebar, TOC, pager, footer, copy page

**Files:**

- Create: `apps/docs/src/layouts/Docs.astro`
- Create: `apps/docs/src/components/site/Header.astro`, `Sidebar.astro`, `Toc.astro`, `Pager.astro`, `Footer.astro`, `CopyPage.astro`, `ThemeToggle.astro`, `FrameworkSwitcher.tsx`, `Wordmark.astro`, `FrameworkMark.astro`
- Create: `apps/docs/src/pages/docs/[...slug].astro`
- Modify: `apps/docs/src/styles/site.css`

**Interfaces:**

- Consumes: `NAV`, `neighbours`, `render()` from `astro:content`.
- Produces: `Docs.astro` props `{ entry: CollectionEntry<"docs">; headings: MarkdownHeading[] }`.

- [ ] **Step 1: Route `src/pages/docs/[...slug].astro`**

```astro
---
import { getCollection, render } from "astro:content"
import Docs from "../../layouts/Docs.astro"
import * as mdx from "../../components/mdx"

export async function getStaticPaths() {
  const entries = await getCollection("docs")
  return entries.map((entry) => ({
    params: { slug: entry.id === "index" ? undefined : entry.id },
    props: { entry },
  }))
}
const { entry } = Astro.props
const { Content, headings } = await render(entry)
---
<Docs entry={entry} headings={headings}>
  <Content components={mdx} />
</Docs>
```

`/docs` (slug undefined) renders `index.mdx`.

- [ ] **Step 2: `Docs.astro`** — three-column grid on ≥ 1280px (`240px 1fr 220px`), sidebar collapsible drawer under 1024px (button in header, `aria-expanded`, Esc closes — port `Shell.tsx:61-87`). Article: title, description, optional `links` badges ("Docs ↗", "API ↗"), `<CopyPage />` on the right of the title row, slot, `<Pager />` when `entry.data.pager`. Right rail: `<Toc headings />` when `entry.data.toc`.

- [ ] **Step 3: `Header.astro`** — sticky, `border-b border-newt-border bg-newt-bg-base/80 backdrop-blur`. Left: `<Wordmark />` + nav links `Docs /docs`, `Components /docs/components`, `Blocks /blocks`, `Colors /colors`, `Themes /themes`, `Changelog /docs/changelog` (Blocks/Colors/Themes/Changelog point at phase 2/6 pages; render them now, they 404 until then — acceptable on the feature branch, but **hide them behind a `SITE.nav` flag array so `main` never links to a 404**). Right: search trigger (Task 8), `<FrameworkSwitcher client:load />`, `<ThemeToggle />`, GitHub icon link.

- [ ] **Step 4: `FrameworkSwitcher.tsx`** — port `Sidenav.tsx:28-46` + `Segmented.tsx` as a React island: two `aria-pressed` buttons writing `$framework`.

- [ ] **Step 5: `ThemeToggle.astro`** — button with sun/moon inline SVG, `<script>` toggling `$theme` (import the store in the script; Astro bundles it).

- [ ] **Step 6: `Sidebar.astro`** — groups from `NAV`, active link via `Astro.url.pathname`, badge dot for `new`. Component count in footer (`COMPONENTS.length`).

- [ ] **Step 7: `Toc.astro`** — headings depth 2–3, scroll-spy `<script>` toggling `aria-current`.

- [ ] **Step 8: `Pager.astro`** — `neighbours(Astro.url.pathname)`, labelled prev/next.

- [ ] **Step 9: `CopyPage.astro`** — dropdown: "Copy page" (fetch `${pathname}.md`, `navigator.clipboard.writeText`), "View as Markdown" (`href=${pathname}.md`), "Open in Claude" (`https://claude.ai/new?q=` + encoded prompt `Read ${canonical}.md and help me use it`), "Open in ChatGPT" (`https://chatgpt.com/?q=`). Endpoint is Task 9; link is fine to add now.

- [ ] **Step 10: `Footer.astro`** — port `Footer.tsx` verbatim (license, GitHub, trademark link, disclaimer paragraph).

- [ ] **Step 11: `site.css`** — keep lines 1–~150 (token bridge + light palette) untouched. Replace the `@layer components` chrome classes (`.layout`, `.sidenav`, `.menu-toggle`, …) with the new layout's classes. Delete anything unused (run `pnpm knip` later; CSS is not knip's domain, so grep each class name).

- [ ] **Step 12: Verify** — `pnpm --filter docs dev`, open `/docs/components/button`: header, sidebar with 7 groups, TOC with Installation/Usage/Tokens, pager to Badge? (check `neighbours`), theme toggle flips the palette, framework switcher flips demo + code + install paths. Keyboard: Tab reaches every control, sidebar drawer traps nothing.

- [ ] **Step 13: Commit** — `git commit -m "feat(docs): shadcn-style docs layout with header, sidebar, toc, pager and copy page"`

---

### Task 8: Search (Pagefind, ⌘K)

**Files:**

- Create: `apps/docs/src/components/site/Search.astro`

- [ ] **Step 1: Trigger + dialog** — header button `Search… ⌘K` opens a `<dialog>` styled like the newt modal (`bg-newt-bg-floating`, `shadow-elevation-high`). `<script>` binds `⌘K`/`Ctrl+K`, loads `/pagefind/pagefind.js` lazily on first open (`import(/* @vite-ignore */ "/pagefind/pagefind.js")`), runs `pagefind.search(q)`, renders up to 8 results (title, excerpt, URL), arrow-key navigation, Enter navigates, Esc closes.

- [ ] **Step 2: Index scope** — add `data-pagefind-body` to the `<article>` in `Docs.astro`, `data-pagefind-ignore` to `.demo-frame` and code blocks, `data-pagefind-meta="title"` on the `<h1>`.

- [ ] **Step 3: Verify** — `pnpm --filter docs exec astro build` then `astro preview`; search "avatar" returns the Avatar page. (Pagefind only indexes on build; in `dev` the dialog shows a "Search is available in the built site" note.)

- [ ] **Step 4: Commit** — `git commit -m "feat(docs): pagefind search dialog"`

---

### Task 9: Machine routes — `.md` twins, `llms.txt`, 404, sitemap

**Files:**

- Create: `apps/docs/src/pages/docs/[...slug].md.ts`, `apps/docs/src/pages/llms.txt.ts`, `apps/docs/src/pages/llms-full.txt.ts`, `apps/docs/src/pages/404.astro`

- [ ] **Step 1: `[...slug].md.ts`**

```ts
import type { APIRoute, GetStaticPaths } from "astro"
import { getCollection } from "astro:content"

export const getStaticPaths: GetStaticPaths = async () =>
  (await getCollection("docs")).map((entry) => ({
    params: { slug: entry.id === "index" ? undefined : entry.id },
    props: { entry },
  }))

export const GET: APIRoute = ({ props }) => {
  const { entry } = props
  const body = `# ${entry.data.title}\n\n> ${entry.data.description}\n\n${entry.body ?? ""}`
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
```

Note: `/docs` twin becomes `/docs.md`? With `slug` undefined Astro emits `/docs/.md` — instead special-case: for `index`, set `params.slug` to `"index"` so the twin is `/docs/index.md`, and make `CopyPage` compute the `.md` URL with the same rule.

- [ ] **Step 2: `llms.txt.ts`** — H1 `# newt/ui`, blockquote (SITE.tagline + "Discord-inspired, not affiliated with Discord Inc."), `## Docs` list of every non-component page `- [title](https://newtui.dev/docs/<id>.md): description`, `## Components` one line per component, `## Registry` with `/r/index.json` and `/vue/r/index.json`, `## Optional` with GitHub and DISCLAIMER links. `llms-full.txt.ts`: same header then every page's `.md` body separated by `\n\n---\n\n`.

- [ ] **Step 3: `404.astro`** — port `NotFound.tsx` in `Base.astro`. Astro emits `dist/404.html` natively; remove the copy in `bundle-registry.mjs:49` (keep the rest).

- [ ] **Step 4: Verify** — build; `curl` the preview: `/docs/components/button.md` starts with `# Button`; `/llms.txt` lists 55 components; `/404.html` exists.

- [ ] **Step 5: Commit** — `git commit -m "feat(docs): markdown twins, llms.txt and 404"`

---

### Task 10: Port the three existing pages to MDX and the home page

**Files:**

- Create: `apps/docs/src/content/docs/index.mdx`, `installation.mdx`, `using-with-ai.mdx`
- Create: `apps/docs/src/pages/index.astro`, `apps/docs/src/pages/docs/components/index.astro`
- Delete: `apps/docs/src/pages/Home.tsx`, `Installation.tsx`, `UsingWithAI.tsx`, `ComponentPage.tsx`, `NotFound.tsx`, `apps/docs/src/App.tsx`, `apps/docs/src/site/**`

- [ ] **Step 1: `index.mdx`** (Introduction) — title "Introduction", description SITE.tagline. Sections from `Home.tsx` "principles" (`#principles`) rewritten as prose: what newt/ui is, copy-paste model, React + Vue + HTML, tokens, trademark note linking `/docs/trademark` (phase 2; link to DISCLAIMER on GitHub until then).

- [ ] **Step 2: `installation.mdx`** — port `Installation.tsx` section by section (`#requirements`, `#init`, `#add`, `#written`, `#tokens`, `#nuxt`, `#next`, `#html`, `#options`) as `##` headings. Commands in fenced ```bash blocks; framework-specific blocks wrapped in `<div data-framework="react">` / `vue`. Phase 2 splits this into per-bundler pages; keep anchors identical now.

- [ ] **Step 3: `using-with-ai.mdx`** — port `UsingWithAI.tsx` (`#why`, `#house-rules`, `#cli`, `#wiring`, `#html`, `#review`, `#limits`).

- [ ] **Step 4: `src/pages/index.astro`** — home in `Base.astro`: hero (title, tagline, `npx newtui@latest init` with copy button, CTA "Get started" → `/docs/installation`, "Browse components" → `/docs/components`), three live `<ComponentPreview>` (`message-group`, `member-list`, `select-menu` — same as `Home.tsx` showcase), principles grid, footer.

- [ ] **Step 5: `src/pages/docs/components/index.astro`** — in `Docs.astro` with a synthetic entry (`title: "Components"`): grid of all components grouped by category, each card linking to its page with title + description.

- [ ] **Step 6: Delete the SPA** — `git rm -r apps/docs/src/site apps/docs/src/App.tsx apps/docs/src/pages/*.tsx apps/docs/src/vue`. Grep for leftovers: `rg -n "src/site|VueIsland|useRouter" apps/docs` → none.

- [ ] **Step 7: Verify** — `pnpm --filter docs exec astro check` clean; `pnpm --filter docs exec astro build` succeeds; open `/`, `/docs`, `/docs/installation#tokens`, `/docs/using-with-ai`, `/docs/components`.

- [ ] **Step 8: Commit** — `git commit -m "feat(docs): port home, installation and using-with-ai to MDX; remove Vite SPA"`

---

### Task 11: Deployment contract check and CI

**Files:**

- Create: `apps/docs/scripts/verify-dist.mjs`
- Modify: `apps/docs/scripts/bundle-registry.mjs` (remove 404 copy)
- Modify: `turbo.jsonc` (no change expected; confirm `docs#build` outputs `dist/**`)
- Modify: `AGENTS.md` (repository layout entry for `apps/docs`), `README.md:158-190` "Documentation site" section, `.skills/newt-ui-architecture/SKILL.md` (docs paragraph)

- [ ] **Step 1: `verify-dist.mjs`**

```js
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const dist = resolve(import.meta.dirname, "../dist")
const required = [
  "index.html",
  "404.html",
  "llms.txt",
  "llms-full.txt",
  "sitemap-index.xml",
  "pagefind/pagefind.js",
  "r/index.json",
  "r/styles/default/button.json",
  "vue/r/index.json",
  "vue/r/styles/default/button.json",
  "docs/index.html",
  "docs/installation/index.html",
  "docs/components/button/index.html",
  "docs/components/button.md",
]
const missing = required.filter((f) => !existsSync(resolve(dist, f)))
if (missing.length) {
  console.error("dist is missing:\n  " + missing.join("\n  "))
  process.exit(1)
}
const llms = readFileSync(resolve(dist, "llms.txt"), "utf8")
const components = (llms.match(/\/docs\/components\/[a-z0-9-]+\.md/g) ?? [])
  .length
if (components < 55) {
  console.error(`llms.txt lists ${components} components, expected >= 55`)
  process.exit(1)
}
console.log(`dist ok (${components} components)`)
```

- [ ] **Step 2: Run the full pipeline** — from the root: `pnpm build` (turbo builds both registries first). Expected last line from docs: `dist ok (55 components)`.

- [ ] **Step 3: Quality gates** — `pnpm format`, `pnpm lint`, `pnpm knip`, `pnpm typecheck`. Fix everything; if knip flags `astro-pagefind`/`@astrojs/*` as unused because it cannot see `astro.config.ts`, add `apps/docs/astro.config.ts` to knip's `entry` for the `docs` workspace in `knip.json` rather than ignoring the dependency.

- [ ] **Step 4: Docs about the docs** — update `AGENTS.md` "Repository layout" (`apps/docs`: Astro, content in `src/content/docs`, `pnpm --filter docs docs:gen` after adding a component), `README.md` "Documentation site", and step 2/3 of "Adding or changing a component" (docs file is now `apps/docs/src/content/docs/components/<name>.mdx`, generated by `docs:gen`). Update `.skills/newt-ui-components/SKILL.md` wherever it names the old docs paths.

- [ ] **Step 5: Lighthouse** — `pnpm --filter docs preview`, run Lighthouse (Chrome DevTools) on `/docs/components/button` in both themes. Accessibility ≥ 95. Fix contrast issues with tokens, not new hex values.

- [ ] **Step 6: Commit** — `git commit -m "chore(docs): verify deployment contract after build; update agent docs"`

- [ ] **Step 7: PR** — title `feat(docs): rebuild the docs site on Astro (phase 1)`, body links the spec and this plan, lists the success criteria from spec §8 that apply (build artefacts, 55 components, Lighthouse, gates). No changeset (no published package changed).

---

## Self-review

- Spec coverage (phase 1 scope): header ✓ (Task 7), sidebar/TOC/pager ✓ (7), search ✓ (8), copy page + `.md` + llms.txt ✓ (7, 9), theme toggle + light mode ✓ (3, 7), framework switcher ✓ (3, 6, 7), MDX collections ✓ (5), component page anatomy items 1–4, 8, 9 ✓ (6, 7) — items 5–7 (examples, API tables, accessibility) are phase 2 by design; registry CDN contract ✓ (11); SPA removal ✓ (10).
- Names used consistently: `$framework`, `$theme`, `COMPONENTS`, `findComponent`, `reactDemos`, `vueDemos`, `demoSource`, `uiSource`, `NAV`, `neighbours`, `SITE`; aliases `@/registry`, `@/lib/registry`, `@/lib/utils`, `@/styles`, `@/components`, `@/stores` (add the last three to both `astro.config.ts` and `tsconfig.json` in Task 2, Step 2/3).
- Open verification points, checked at execution: exact `astro check` dependency name (Task 2), `@nanostores/vue` `useStore` API (Task 1 spike), Pagefind script path `/pagefind/pagefind.js` (Task 8), `.md` twin naming for the `index` entry (Task 9).
