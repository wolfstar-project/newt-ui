# Contributing to newt/ui

Thanks for your interest in contributing. Please read this guide before
opening a pull request.

## Repository structure

```
apps
├── docs           # Shared documentation site (Blume)
├── www            # React registry builder (Next.js, shadcn-ui layout)
└── vue            # Vue registry builder (Nuxt, shadcn-vue layout)
packages
├── cli            # `newtui` CLI (React + Vue) + HTML/CSS registry sources
└── module         # Nuxt module
templates
├── next-template
└── nuxt-template
```

| Path                           | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| `apps/docs/content/docs`       | Shared React/Vue documentation (MDX)                 |
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
4. Add the shared docs page in `apps/docs/content/docs/components/<name>.mdx`.
5. Run `node scripts/gen-registry.mjs && pnpm registry:build`.
6. Add a changeset: `pnpm changeset`.

Read `AGENT_GUIDE.md` for design-token and naming conventions.

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
`feat(www): add voice-channel component`, `fix(cli): resolve registry path`.

## AI-assisted contributions

AI tools are welcome, but you remain responsible for everything you submit.
Review and understand every change, and make sure the pull request
description reflects your own understanding rather than unedited generated
text.

If an AI agent or tool wrote or edited the code or the pull request
description, end the pull request body with a disclosure line, outside the
template sections:

```md
> 🤖 AI disclosure: <agent or tool name> was used on this PR. Code written with <model id>; PR description written with <model id>. [AI policy](https://github.com/wolfstar-project/newt-ui/blob/main/CONTRIBUTING.md#ai-assisted-contributions).
```

- Use the exact model ids that were used, never a guess. If the code and the
  description came from different models or tools, name each one.
- Leave the line out when no AI tool was involved.
- Add it whenever you edit an existing pull request description with AI, and
  never remove a disclosure line another contributor left.
