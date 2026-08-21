# Contributing to newt/ui

Thanks for your interest in contributing. Please read this guide before
opening a pull request.

## Repository structure

```
apps
├── www            # React docs site + React registry (Next.js, shadcn-ui layout)
└── vue            # Vue docs site + Vue registry (Nuxt, shadcn-vue layout)
packages
├── newt-ui        # `newt-ui` CLI for React + HTML/CSS registry sources
├── cli            # `newt-ui-vue` CLI for Vue
└── module         # Nuxt module
templates
├── next-template
└── nuxt-template
```

| Path                             | Description                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `apps/www/registry`              | React components (`registry/<style>/ui`) and examples                         |
| `apps/www/components/docs`       | Docs chrome (side nav, page header, component section, preview frame)         |
| `apps/www/styles/docs.css`       | Docs site styling, ported verbatim from the original single-page `index.html` |
| `apps/www/content/docs`          | React documentation (MDX)                                                     |
| `apps/vue/src/lib/registry`      | Vue components (`registry/<style>/ui/<name>`) and examples                    |
| `apps/vue/src/content/docs`      | Vue documentation (Markdown)                                                  |
| `packages/newt-ui/registry/html` | Original HTML/CSS sources and `tokens.css`                                    |

## Development

```bash
pnpm install
pnpm dev            # all apps
pnpm --filter www dev
pnpm --filter vue-www dev
```

## Adding a component

1. Add the React component to `apps/www/registry/default/ui/<name>.tsx` and
   register it in `apps/www/registry/registry-ui.ts`.
2. Add an example to `apps/www/registry/default/example/<name>-demo.tsx` and
   register it in `apps/www/registry/registry-examples.ts`.
3. Add docs in `apps/www/content/docs/components/<name>.mdx`.
4. Repeat for Vue in `apps/vue/src/lib/registry/default/ui/<name>/` and
   `apps/vue/src/content/docs/components/<name>.md`.
5. Run `pnpm registry:build`.
6. Add a changeset: `pnpm changeset`.

Read `AGENT_GUIDE.md` for design-token and naming conventions.

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
`feat(www): add voice-channel component`, `fix(cli): resolve registry path`.
