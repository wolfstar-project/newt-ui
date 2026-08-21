---
name: newt-ui-cli
description: Use when adding or changing newt-ui / newt-ui-vue CLI commands, flags, prompts, output, exit codes, or file writing.
---

# newt/ui CLIs

Two published CLIs with the same command surface: `newt-ui` (React,
`packages/newt-ui`) and `newt-ui-vue` (Vue, `packages/cli`), plus the legacy
`newt-ui-html` bin that copies the raw HTML/CSS registry. They follow the
`create-http-framework` layout: `mri` for parsing, `@clack/prompts` for
interaction, `tsdown` for the build.

## Layout

- `src/index.ts` — argv parsing, `printHelp()`, command dispatch, `main()`.
- `src/commands/{init,add,list,diff}.ts` — one file per command.
- `src/tools/*.ts` — focused helpers: `options.ts` (every flag table declared
  `as const`, with the derived union types), `config.ts`, `registry.ts`,
  `transformers.ts`, `tokens.ts`, `packageManager.ts`, `fileSystem.ts`,
  `logger.ts`, `prompts.ts`, `schema.ts`.

## Rules

- Keep parsing pure and in `src/index.ts` + `src/tools/options.ts`; keep
  prompts and terminal effects out of the command logic.
- Every interactive input needs a non-interactive equivalent (`--yes`,
  `--defaults`, and the explicit value flags). A CLI run in CI must never
  block on a prompt.
- Flags are declared once in `options.ts`. Adding a flag means adding it to
  `BOOLEAN_FLAGS`/`STRING_FLAGS` (and `FLAG_ALIASES` if it gets a short form),
  never reaching into `argv` ad hoc.
- Validate everything that comes from the network with the zod schemas in
  `src/tools/schema.ts` before writing a file.
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
- The two CLIs stay independent copies. Do not factor shared code into a
  third package.

## Adding a command

1. Add it to `COMMANDS` in `options.ts` with its flags.
2. Implement it in `src/commands/<name>.ts`.
3. Add it to `printHelp()` and to the README of the package.
4. Verify interactive and non-interactive paths.
5. Build (`pnpm --filter <pkg> build`) and smoke-test the built `dist/index.js`
   against a local registry — serve `apps/*/public` over HTTP and run the real
   command in a scratch directory. Do not claim a CLI works without doing this.
