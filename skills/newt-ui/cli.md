# The newtui CLI

One CLI for React and Vue. It detects the framework during `init` and records
it in `components.json`; every later command reads it from there.

| Command                        | What it does                                                          |
| ------------------------------ | --------------------------------------------------------------------- |
| `newtui init`                  | Writes `components.json`, the `cn` helper, and the `--newt-*` tokens. |
| `newtui add <names...>`        | Writes components and everything they depend on.                      |
| `newtui list`                  | Prints the registry.                                                  |
| `newtui search [query]`        | Filters it by name, title or description.                             |
| `newtui view <names...>`       | Prints an item's source without installing it.                        |
| `newtui diff <name>`           | Compares an installed component against the registry.                 |
| `newtui info`                  | What this project is and what it has installed.                       |
| `newtui mcp`                   | Runs the MCP server over stdio.                                       |
| `newtui mcp init --client <c>` | Writes the MCP config for an editor.                                  |
| `newtui apply --preset <code>` | Applies a newt/create preset to a project that already ran `init`.    |
| `newtui preset decode <code>`  | Reads a preset code; `encode` and `css` go the other ways.            |

Flags worth knowing:

- `--json` on `list`, `search`, `view` and `info` — machine-readable output.
  Prefer it when you are going to parse the result.
- `--overwrite` on `add` — take the registry version back over local edits.
  Destructive; ask first.
- `--skip-install` on `init` and `add` — write files, leave the package manager
  alone.
- `--registry <url>` / `NEWT_REGISTRY_URL` — read from another registry.
- `--template <next|vite-react|vite-vue|nuxt>` on `init` — creates the project
  with that framework's own creator first, then initialises inside the result.
  Only those four; every other target is created by its own tool.
- `--preset <code>` on `init` and `apply` — a `nt1.…` code from
  [newt/create](https://newtui.dev/create). It writes a small block of
  `--newt-*` overrides after the token block, and replaces an earlier one
  rather than stacking a second.
- `--legacy` — the plain HTML/CSS CLI, which copies BEM stylesheets instead.

Do not run `add --all`, `--overwrite` or `init` in a project you did not set up
without asking: each writes over files somebody owns.
