---
"@newtui/mcp": minor
---

New package: `@newtui/mcp`, an MCP server for the newt/ui documentation. Run it with `npx @newtui/mcp` and an agent gets three read-only tools — `list_docs`, `search_docs` and `get_doc` — that read the `llms.txt` index, the `llms-full.txt` bodies and each page's Markdown twin from https://newtui.dev, with a short in-memory cache. Point it at another build of the site with `--url` or `NEWTUI_DOCS_URL`, e.g. `http://localhost:4321` while writing docs.
