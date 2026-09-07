---
name: newt-ui
description: Use when building or reviewing a Discord-inspired interface with newt/ui in React, Vue or plain HTML — installing components, composing them, styling through --newt-* tokens, RTL, forms, and the trademark rules that apply to every example.
allowed-tools: Bash(npx newtui@latest *)
---

# newt/ui

A copy-paste component library for Discord-inspired interfaces, shipped for
React, Vue and plain HTML/CSS on one `--newt-*` design token layer. Components
are copied into the project by a CLI; there is no runtime package to depend on.

## This project

Run this before writing any UI, and work from what it says rather than from the
file tree:

!`npx newtui@latest info --json`

It reports the framework, the bundler, the Tailwind major, where the aliases
point, which registry the project reads, and which components are already
installed. If it errors with "No components.json", the project has not been set
up — run `npx newtui@latest init` first, or say so and stop.

## Principles

1. **The vocabulary is closed.** 55 components and one token layer. If
   `newtui search` does not print a name, it does not exist; use the closest
   real component or say what is missing.
2. **Tokens, never literals.** Every colour, radius, shadow, font and duration
   is a `--newt-*` custom property. See `rules/tokens.md`.
3. **Compose, do not invent.** A missing piece is composed from the parts that
   exist, or it is an issue. A new component "in the library's style" looks
   right and shares none of the structure. See `rules/composition.md`.
4. **The source is local.** After `add`, the component is a file in the project.
   Read it rather than recalling its props.
5. **No Discord assets, ever.** See `rules/trademark.md`.

## Discovery

```bash
npx newtui@latest search presence        # find by name, title or description
npx newtui@latest view status-indicator  # read the source without installing
npx newtui@latest add status-indicator   # write it, with what it depends on
```

`add` resolves registry dependencies first, so asking for `chat` also writes
`message-list`, `message-group` and `scrollbar`. Never hand-write a component
that the registry ships.

If the editor has the MCP server configured (`npx newtui@latest mcp init
--client claude`), prefer its tools over the shell: they answer the same
questions without spawning a process. See `mcp.md`.

## More

- `cli.md` — every command and flag.
- `customization.md` — theming, the light palette, and what to override.
- `mcp.md` — the MCP tools and when to reach for each.
- `rules/tokens.md`, `rules/composition.md`, `rules/accessibility.md`,
  `rules/trademark.md` — the four rules, each with incorrect and correct pairs.

Full documentation, in a form you can read whole:
<https://newtui.dev/llms.txt>. Every page has a markdown twin at its own URL
plus `.md`.

## Before you report finished

```bash
npx newtui@latest info --json     # the components you claimed to use are installed
```

Then walk the checklist in `rules/` — or ask the MCP server for
`get_audit_checklist`, which is the same list.
