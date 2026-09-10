---
"newtui": minor
---

Add an MCP server and three read-only commands, so an agent can discover the registry instead of guessing at it.

`newtui mcp` runs a Model Context Protocol server over stdio, and `newtui mcp init --client claude|cursor|vscode|codex|opencode` writes the configuration each editor needs — merging into whatever is already in the file rather than replacing it. The server exposes eight tools, named to match shadcn's so an agent that knows one registry needs no new vocabulary: `get_project_registries`, `list_items_in_registries`, `search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries`, `get_add_command_for_items`, `get_audit_checklist`, and `get_design_tokens`, which returns the `--newt-*` palette. Two prompts, `install-component` and `build-with-newt`, walk the search-then-install path. Everything is read-only: installing stays a command somebody runs.

Three new commands back it, and stand on their own:

- `newtui info [--json]` prints what a project is — framework, bundler, Tailwind major, aliases, registry, and which components are installed.
- `newtui search [query] [--json]` filters the registry by name, title or description.
- `newtui view <components...> [--json]` prints an item's source without installing it.

The package now ships a test suite (`vitest`), covering registry URL resolution, the MCP tool and prompt surface, and that `mcp init` preserves the servers a config already had.
