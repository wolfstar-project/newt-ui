# newtui

CLI for [newt/ui](https://newtui.dev) — Discord-native UI components for React, Vue and Nuxt, distributed shadcn-style: the source is copied into your project, you own it.

```bash
npx newtui init          # writes components.json, lib/utils.ts, appends --newt-* tokens to your CSS
npx newtui add button    # copies components + resolves registryDependencies + installs npm deps
npx newtui list          # lists registry items
npx newtui diff button   # compares local files with the registry

npx newtui init --template next --preset nt1.…   # create the project, then wear the preset
npx newtui apply --preset nt1.…                  # restyle a project that already ran init
npx newtui preset decode nt1.…                   # read what a preset code carries
```

## Framework

`init` detects whether the project is React or Vue and records the result as `framework` in `components.json`. Override it with `--framework react|vue`. Vue projects also record a `bundler` (`nuxt` or `vite`), which decides where the stylesheet lives and which setup instructions are printed — pass `--bundler nuxt|vite` to force it.

Every command reads `framework` back from `components.json`, so `add`, `diff` and `list` all target the right registry without being told again.

## Registry

Each framework has its own registry, and every item carries a `framework` field naming which one it came from:

| Framework | Registry                                              |
| --------- | ----------------------------------------------------- |
| React     | `https://newtui.dev/r/styles/<style>/<name>.json`     |
| Vue       | `https://newtui.dev/vue/r/styles/<style>/<name>.json` |

Override the base url with `--registry <url>` or `NEWT_REGISTRY_URL`, or set `"registry"` in `components.json`.

## Third-party registries

`add` and `view` also take `@registry/item`, which installs from a shadcn-compatible registry that is not this one:

```bash
npx newtui add @magicui/marquee      # React project: the shadcn/ui directory
npx newtui add @ai-elements/message  # Vue project: the shadcn-vue directory
```

A namespace resolves through `registries` in `components.json` first, then through the community directory of the project's framework (`https://ui.shadcn.com/r/registries.json` for React, `https://www.shadcn-vue.com/r/registries.json` for Vue; `NEWT_REGISTRY_DIRECTORY_URL` overrides it). A `registries` entry is a URL template with `{name}`, or an object with `url`, `headers` and `params`; `${NAME}` is expanded from the environment.

A third-party item's bare `registryDependencies` are shadcn components and resolve from `@shadcn`. On Tailwind v4 the first third-party install appends one `@theme inline` block mapping shadcn's colour names (`primary`, `muted-foreground`, …) onto the `--newt-*` tokens. Registry paths that are absolute or contain `..` are refused.

## Older `components.json` files

An existing `components.json` keeps working — it is migrated on read:

- `framework: "nuxt" | "vite"` (the old Vue build tool) becomes `bundler`, and `framework` becomes `"vue"`.
- `tsx` (the old React flag) is read as `typescript`.
- A config with neither field is matched to a framework by the aliases it declares.

## Legacy HTML/CSS registry

The original framework-less HTML/CSS CLI is still shipped:

```bash
npx newtui --legacy init
npx newtui-html init      # same thing
```

## Development

```bash
pnpm build       # tsdown -> dist/index.js
pnpm typecheck   # tsc --noEmit
```
