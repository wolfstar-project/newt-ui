# @newtui/mcp

## 0.1.1

### Patch Changes

- [#29](https://github.com/wolfstar-project/newt-ui/pull/29) [`c509c7e`](https://github.com/wolfstar-project/newt-ui/commit/c509c7e6c5b2e8e2eff42947053e7e3096f62410) - fix(deps): update all non-major dependencies Thanks [@renovate](https://github.com/apps/renovate)!

## 0.1.0

### Minor Changes

- [#24](https://github.com/wolfstar-project/newt-ui/pull/24) [`dc0b233`](https://github.com/wolfstar-project/newt-ui/commit/dc0b233e13e524b76f5228e77322ad4b1032009e) - New package: `@newtui/mcp`, an MCP server for the newt/ui documentation. Run it with `npx @newtui/mcp` and an agent gets three read-only tools — `list_docs`, `search_docs` and `get_doc` — that read the `llms.txt` index, the `llms-full.txt` bodies and each page's Markdown twin from https://newtui.dev, with a short in-memory cache. Point it at another build of the site with `--url` or `NEWTUI_DOCS_URL`, e.g. `http://localhost:4321` while writing docs.
