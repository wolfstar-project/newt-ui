# @newtui/mcp

An [MCP](https://modelcontextprotocol.io) server for the [newt/ui](https://newtui.dev) documentation — Discord-inspired components for React, Vue and plain HTML/CSS. It gives your editor's agent the docs themselves: installation per framework, theming, the token reference, accessibility notes and the registry format, read from the site rather than recalled from memory.

It is the companion to `newtui mcp`, the server inside the CLI: that one answers _which components exist and what their source is_; this one answers _what the documentation says_. Run both.

```bash
npx @newtui/mcp
```

## Tools

Every tool is read-only.

| Tool          | What it returns                                                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_docs`   | Every page with its title, route, description and section. `section` filters to one heading of the index, e.g. `Installation`.                     |
| `search_docs` | Pages ranked by where every keyword appears — title, route, description, section. `content: true` searches page bodies too and adds an excerpt.    |
| `get_doc`     | One page as Markdown. Takes a route (`/docs/theming`), a slug (`button`, `installation/nuxt`) or a full URL; an unknown page answers with matches. |

## Configure your client

```json
{
  "mcpServers": {
    "newtui-docs": {
      "command": "npx",
      "args": ["-y", "@newtui/mcp@latest"]
    }
  }
}
```

That shape works for Claude Code (`.mcp.json`), Cursor (`.cursor/mcp.json`) and most other clients. Claude Code can also add it in one line:

```bash
claude mcp add newtui-docs -- npx -y @newtui/mcp@latest
```

## Pointing it at another site

The site resolves as `--url` > `NEWTUI_DOCS_URL` > `https://newtui.dev`:

```bash
npx @newtui/mcp --url http://localhost:4321
NEWTUI_DOCS_URL=http://localhost:4321 npx @newtui/mcp
```

The server reads what the site publishes for agents: `llms.txt` for the page index, `llms-full.txt` for full-text search, and the `.md` twin of every page. The Blume dev server serves the twins but not the two `llms` files, so against `localhost:4321` the index comes from the JSON docs API (`/api/docs/pages.json`) and `search_docs` falls back to titles and descriptions — the answer says so in `searchedContent`. A built site (`pnpm --filter docs build`, then any static server on `apps/docs/dist`) has everything.

Responses are cached in memory for five minutes; a 404 is cached too, a server error is not.

## Development

```bash
pnpm build       # tsdown -> dist/index.js
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest, with the network replaced by an in-memory site
```

newt/ui is an independent, community-built project. It is visually inspired by Discord's client but is not affiliated with, endorsed by, or sponsored by Discord Inc.
