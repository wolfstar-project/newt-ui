# newt-ui

CLI for [newt/ui](https://wolfstar-project.github.io/newt-ui) — Discord-native UI components for React, distributed shadcn-style: the source is copied into your project, you own it.

```bash
npx @wolfstar/newt-ui init          # writes components.json, lib/utils.ts, appends --newt-* tokens to your CSS
npx @wolfstar/newt-ui add button    # copies components + resolves registryDependencies + installs npm deps
npx @wolfstar/newt-ui list          # lists registry items
npx @wolfstar/newt-ui diff button   # compares local files with the registry
```

## Registry

Components are fetched from `https://wolfstar-project.github.io/newt-ui/r/styles/<style>/<name>.json`.
Override with `--registry <url>` or `NEWT_REGISTRY_URL`, or set `"registry"` in `components.json`.

## Legacy HTML/CSS registry

The original framework-less HTML/CSS CLI is still shipped:

```bash
npx @wolfstar/newt-ui --legacy init
npx @wolfstar/newt-ui --legacy add button   # same thing
```

## Development

```bash
pnpm build       # tsup -> dist/index.js
pnpm typecheck   # tsc --noEmit
```
