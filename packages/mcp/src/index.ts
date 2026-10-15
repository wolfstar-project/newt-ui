import { parseArgs } from "node:util"

import packageJson from "../package.json" with { type: "json" }
import { DEFAULT_DOCS_URL, DocsClient, resolveDocsUrl } from "./docs.js"
import { startServer } from "./server.js"

const HELP = `newtui-mcp — an MCP server for the newt/ui documentation

Usage
  $ npx @newtui/mcp [--url <site>]

Options
  --url <site>   the docs site to read (default: ${DEFAULT_DOCS_URL})
                 also read from NEWTUI_DOCS_URL
  -h, --help     show this help
  -v, --version  print the version

The server speaks MCP over stdio; an editor launches it, not a person.`

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      url: { type: "string" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
  })
  if (values.help === true) {
    console.log(HELP)
    return
  }
  if (values.version === true) {
    console.log(packageJson.version)
    return
  }
  const baseUrl = resolveDocsUrl(values.url, process.env.NEWTUI_DOCS_URL)
  let docs: DocsClient
  try {
    docs = new DocsClient({ baseUrl })
  } catch {
    console.error(`newtui-mcp: "${baseUrl}" is not a URL.`)
    process.exit(1)
  }
  await startServer(docs)
}

main().catch((error) => {
  console.error(
    `newtui-mcp: ${error instanceof Error ? error.message : String(error)}`
  )
  process.exit(1)
})
