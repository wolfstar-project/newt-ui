# The newt/ui MCP server

`npx newtui@latest mcp init --client claude|cursor|vscode|codex|opencode` writes
the configuration; the server itself is `npx newtui@latest mcp` over stdio.

Prefer these tools over shelling out when they are available: they answer the
same questions without spawning a process, and they read the project's own
`components.json`, so they are never answering about the wrong registry.

| Tool                                | Reach for it when                                                    |
| ----------------------------------- | -------------------------------------------------------------------- |
| `get_project_registries`            | Starting. It is `newtui info --json`, in one call.                   |
| `list_items_in_registries`          | You need the whole vocabulary.                                       |
| `search_items_in_registries`        | You half-remember a name. Always search before naming a component.   |
| `view_items_in_registries`          | You need a component's real props rather than a recalled API.        |
| `get_item_examples_from_registries` | You want the shortest correct usage, which is what the demos are.    |
| `get_add_command_for_items`         | You are about to install. It uses the project's own package manager. |
| `get_audit_checklist`               | You are about to report finished.                                    |
| `get_design_tokens`                 | You need a colour, radius, shadow or duration. Take it from here.    |

Every tool is read-only. Installing is `get_add_command_for_items` followed by
running that command — do not claim a component is installed until it is.

Two prompts ship with the server: `install-component`, which walks search → view
→ install, and `build-with-newt`, which composes an interface and then checks
itself against the audit checklist.
