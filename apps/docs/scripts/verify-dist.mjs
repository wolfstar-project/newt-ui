import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

/*
 * The site and the registry are one deployment: `/r/**` is what every
 * `components.json` in the wild points `newtui add` at. A build that renders
 * beautifully and drops those files still breaks every consumer, and a build
 * that drops the markdown twins silently breaks the agent-facing half of the
 * documentation. Neither failure is visible by looking at the site, so it is
 * asserted here instead.
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = resolve(root, "dist")

const REQUIRED = [
  "index.html",
  "404.html",
  "llms.txt",
  "llms-full.txt",
  "sitemap-index.xml",
  "pagefind/pagefind.js",
  "r/index.json",
  "r/styles/default/button.json",
  "vue/r/index.json",
  "vue/r/styles/default/button.json",
  "docs/index.html",
  "docs/installation/index.html",
  "docs/using-with-ai/index.html",
  "docs/components/index.html",
  "docs/components/button/index.html",
  "docs/components/button.md",
  "docs/index.md",
  "docs/theming/index.html",
  "docs/dark-mode/index.html",
  "docs/cli/index.html",
  "docs/components-json/index.html",
  "docs/registry/index.html",
  "docs/registry/registry-item-json/index.html",
  "docs/installation/nuxt/index.html",
  "docs/changelog/index.html",
  "docs/design/index.html",
  "docs/trademark/index.html",
  "colors/index.html",
]

const missing = REQUIRED.filter((file) => !existsSync(resolve(dist, file)))
if (missing.length > 0) {
  console.error(`dist is missing:\n  ${missing.join("\n  ")}`)
  process.exit(1)
}

const llms = readFileSync(resolve(dist, "llms.txt"), "utf8")
const listed = (llms.match(/\/docs\/components\/[a-z0-9-]+\.md/g) ?? []).length
const expected = Number(process.env.NEWT_EXPECTED_COMPONENTS ?? 55)
if (listed < expected) {
  console.error(
    `llms.txt lists ${listed} components, expected at least ${expected}`
  )
  process.exit(1)
}

console.log(`dist ok (${listed} components)`)
