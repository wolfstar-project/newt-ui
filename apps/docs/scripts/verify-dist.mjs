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
  "blocks/index.html",
  "create/index.html",
  "docs/create/index.html",
  "docs/forms/index.html",
  "docs/forms/react-hook-form/index.html",
  "docs/rtl/index.html",
  "docs/mcp/index.html",
  "docs/skills/index.html",
  "r/styles/default/chat-window.json",
  "vue/r/styles/default/chat-window.json",
  "r/styles/default/command-panel.json",
  "vue/r/styles/default/command-panel.json",
  "docs/components/command-panel/index.html",
  "typeset/index.html",
  "docs/typeset/index.html",
  "docs/components/typeset/index.html",
  "r/styles/default/typeset.json",
  "vue/r/styles/default/typeset.json",
  /* Installable: the manifest, the worker, and the icons they name. */
  "manifest.webmanifest",
  "sw.js",
  "favicon.ico",
  "apple-touch-icon-180x180.png",
  "pwa-192x192.png",
  "pwa-512x512.png",
  "maskable-icon-512x512.png",
  /* One card per page, rendered at build time. */
  "index.webp",
  "docs/components/button/index.webp",
]

const missing = REQUIRED.filter((file) => !existsSync(resolve(dist, file)))
if (missing.length > 0) {
  console.error(`dist is missing:\n  ${missing.join("\n  ")}`)
  process.exit(1)
}

/*
 * The chrome is the theme's now, and the theme does not know about this site's
 * manifest, icons or service worker: they reach `<head>` only because every
 * route passes them through `buildHead`. A route added later that forgets to
 * is a page the browser silently stops offering to install — and the files
 * listed above are all still on disk, so their presence proves nothing. One
 * page from each layout is read here to check that they are also linked.
 */
const HEAD_LINKED = [
  "index.html",
  "404.html",
  "blocks/index.html",
  "docs/index.html",
  "docs/components/button/index.html",
  "docs/changelog/index.html",
]
const HEAD_TAGS = [
  ['rel="manifest"', "the web app manifest"],
  ["apple-touch-icon", "the touch icon"],
  ['name="theme-color"', "the theme colour"],
  ['rel="canonical"', "the canonical link"],
  ['property="og:image"', "the Open Graph card"],
]

const unlinked = []
for (const page of HEAD_LINKED) {
  const html = readFileSync(resolve(dist, page), "utf8")
  /*
   * `substring` rather than `slice`, which would do the same thing: `slice`
   * reads as an array operation to `unicorn/prefer-set-has`, and the rule's
   * autofix then wraps this in a `new Set(...)` of single characters, where
   * every lookup below misses and the assertion can no longer fail. That
   * autofix has already been applied once by the commit hook.
   */
  const head = html.substring(0, html.indexOf("</head>"))
  for (const [needle, label] of HEAD_TAGS) {
    if (!head.includes(needle)) {
      unlinked.push(`${page} is missing ${label}`)
    }
  }
}
if (unlinked.length > 0) {
  console.error(
    `dist has pages with an incomplete head:\n  ${unlinked.join("\n  ")}`
  )
  process.exit(1)
}

const llms = readFileSync(resolve(dist, "llms.txt"), "utf8")
const listed = (llms.match(/\/docs\/components\/[a-z0-9-]+\.md/g) ?? []).length
const expected = Number(process.env.NEWT_EXPECTED_COMPONENTS ?? 60)
if (listed < expected) {
  console.error(
    `llms.txt lists ${listed} components, expected at least ${expected}`
  )
  process.exit(1)
}

console.log(`dist ok (${listed} components)`)
