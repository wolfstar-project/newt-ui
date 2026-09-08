---
name: newt-ui-cli
description: Use when adding or changing newtui CLI commands, flags, prompts, output, exit codes, or file writing.
---

# newt/ui CLI

One published CLI, `newtui` (`packages/cli`), serving React and Vue from a
single command surface, plus the legacy `newtui-html` bin that copies the raw
HTML/CSS registry. `deprecated/react-cli` (`@newtui/react`) and `deprecated/vue-cli`
(`@newtui/vue`) are deprecation wrappers that forward to it and hold no logic.
Its responsibility folders follow the shadcn CLI layout: `mri` for parsing,
`@clack/prompts` for interaction, `tsdown` for the build.

## Framework dispatch

`components.json` carries `framework: "react" | "vue"`, written by `init` from
detection or `--framework`, and read back by every other command. Vue projects
also carry `bundler: "nuxt" | "vite"`. Behaviour that differs between the two
frameworks — registry base url, import rewriting, write targets, `"use client"`
versus `lang="ts"` stripping — branches on that one field, never on a guess at
the call site.

A `components.json` written by either old CLI is migrated on read
(`migrateComponentsFile` in `utils/get-config.ts`): the old Vue `framework: "nuxt" | "vite"`
becomes `bundler`, and the old React `tsx` becomes `typescript`. Any new
compatibility shim belongs there, not spread across the commands.

## Layout

- `src/index.ts` — argv parsing, `printHelp()`, command dispatch, `main()`.
- `src/commands/{init,add,list,search,view,diff,info}.ts` — one file per
  command. `info` also exports `readProjectInfo()`, the in-process reader the
  MCP server uses instead of shelling out.
- `src/mcp/server.ts` — the MCP server (`newtui mcp`). Tool names mirror
  shadcn's on purpose; renaming one strands every prompt written against it.
  Every tool is read-only: installing is a command the human runs.
- `src/mcp/init.ts` — `newtui mcp init --client <name>`. Each client's config
  is parsed and merged, never overwritten: those files hold other people's
  servers.
- `src/**/*.test.ts` — colocated Vitest tests. Installation tests serve a local
  HTTP registry; they never reach the published registry. The MCP surface is
  exercised through `InMemoryTransport.createLinkedPair()`.
- `src/schema/index.ts` — re-exports the registry wire contracts.
- `src/registry/` — wire schemas, fetching and dependency-tree resolution.
- `src/utils/get-config.ts` — `components.json` schemas, migration and path resolution.
- `src/utils/` — focused helpers; import rewriting lives in
  `utils/transformers/`. `utils/updaters/` writes component files and styles
  and installs dependencies. `src/preflights/` validates the target project
  before `add` fetches or writes registry items.

## Rules

- Keep parsing pure and in `src/index.ts` + `src/utils/options.ts`; keep
  prompts and terminal effects out of the command logic.
- Every interactive input needs a non-interactive equivalent (`--yes`,
  `--defaults`, and the explicit value flags). A CLI run in CI must never
  block on a prompt.
- Flags are declared once in `options.ts`. Adding a flag means adding it to
  `BOOLEAN_FLAGS`/`STRING_FLAGS` (and `FLAG_ALIASES` if it gets a short form),
  never reaching into `argv` ad hoc.
- Validate everything that comes from the network with the zod schemas in
  `src/registry/schema.ts` before writing a file.
- The registry URL resolves as `--registry` > `NEWT_REGISTRY_URL` > the
  package default. Never hardcode a URL at a call site.
- Resolve write targets through the user's `components.json` aliases, not by
  guessing. A `src/`-prefixed css path means the project uses a `src`
  directory, and `init` must resolve `@/lib/utils` into `src/lib/` even
  before that directory exists — otherwise `init` and `add` disagree.
- `add` resolves `registryDependencies` recursively and installs npm
  `dependencies` with the detected package manager; `--skip-install` must
  fully skip that step.
- React writes `ui/<name>.tsx`. Vue writes a directory
  `ui/<name>/{Component.vue,index.ts}` — one component per file, plus the
  barrel that exports the cva variants.

## Adding a command

1. Add it to `COMMANDS` in `options.ts` with its flags.
2. Implement it in `src/commands/<name>.ts`.
3. Add it to `printHelp()`, to the package README, and to the flag list on
   the docs Installation page.
4. Verify interactive and non-interactive paths.
5. Build (`pnpm --filter newtui build`) and smoke-test the built
   `dist/index.js` against a local registry — serve `apps/www/public` and
   `apps/vue/public` over HTTP and run the real command in a scratch directory,
   once per framework. Do not claim the CLI works without doing this.
