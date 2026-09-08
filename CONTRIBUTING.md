# Contributing to newt/ui

Thanks for your interest in contributing. Please read this guide before
opening a pull request.

## Repository structure

```
apps
├── docs           # Shared Astro documentation site
├── www            # React registry builder (Next.js, shadcn-ui layout)
└── vue            # Vue registry builder (Nuxt, shadcn-vue layout)
packages
├── cli            # `newtui` CLI (React + Vue) + HTML/CSS registry sources
└── module         # Nuxt module
deprecated
├── react-cli      # `@newtui/react` forwarding wrapper
└── vue-cli        # `@newtui/vue` forwarding wrapper
templates
├── next-template
└── nuxt-template
```

| Path                           | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| `apps/docs/src/content/docs`   | Shared React/Vue documentation (MDX)                 |
| `apps/www/registry/bases/newt` | React components, blocks, and examples               |
| `apps/www/registry/meta`       | Metadata driving both generated framework registries |
| `apps/vue/registry/bases/newt` | Vue components, blocks, and examples                 |
| `packages/cli/src`             | Published multi-framework CLI implementation         |
| `packages/cli/registry/html`   | Original HTML/CSS sources and `tokens.css`           |

## Development

```bash
pnpm install
pnpm dev            # all apps
pnpm --filter www dev
pnpm --filter vue-www dev
```

## Adding a component

1. Add the React component to `apps/www/registry/bases/newt/ui/<name>.tsx` and
   add its metadata in `apps/www/registry/meta/<name>.json`.
2. Add an example to `apps/www/registry/bases/newt/examples/<name>-demo.tsx`.
3. Repeat for Vue in `apps/vue/registry/bases/newt/ui/<name>/` and
   `apps/vue/registry/bases/newt/examples/<Pascal>Demo.vue`.
4. Add the shared docs page in `apps/docs/src/content/docs/components/<name>.mdx`.
5. Run `node scripts/gen-registry.mjs && pnpm registry:build`.
6. Add a changeset: `pnpm changeset`.

Read `AGENT_GUIDE.md` for design-token and naming conventions.

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
`feat(www): add voice-channel component`, `fix(cli): resolve registry path`.
