import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

import { markdownPathFor } from "../lib/docs"
import { COMPONENTS } from "../lib/registry"
import { SITE } from "../lib/site"

/*
 * The llmstxt.org index: one H1, a blockquote summary, then link lists whose
 * targets are the markdown twins rather than the HTML pages, so an agent
 * following any of them lands on text it can read whole.
 */
export const GET: APIRoute = async () => {
  const entries = await getCollection("docs")
  const componentNames = new Set(COMPONENTS.map((component) => component.name))

  const guides = entries
    .filter((entry) => !entry.data.component)
    .toSorted((a, b) => a.id.localeCompare(b.id))

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.tagline}. Copy-paste components for React, Vue and plain HTML/CSS,`,
    `> built on the --newt-* design token layer. Discord-inspired and independent:`,
    `> not affiliated with, endorsed by, or sponsored by Discord Inc.`,
    "",
    "## Docs",
    "",
    ...guides.map(
      (entry) =>
        `- [${entry.data.title}](${SITE.url}${markdownPathFor(entry.id)}): ${entry.data.description}`
    ),
    "",
    "## Components",
    "",
    ...COMPONENTS.map(
      (component) =>
        `- [${component.title}](${SITE.url}/docs/components/${component.name}.md): ${component.description}`
    ),
    "",
    "## Registry",
    "",
    `- [React registry index](${SITE.registryUrl}/index.json): every React item, for \`newtui add\`.`,
    `- [Vue registry index](${SITE.vueRegistryUrl}/index.json): every Vue item, for \`newtui add\`.`,
    "",
    "## Optional",
    "",
    `- [Full documentation](${SITE.url}/llms-full.txt): every page above, concatenated.`,
    `- [Source](${SITE.github}): the monorepo, including the HTML/CSS originals.`,
    `- [Trademark notice](${SITE.disclaimer}): what this project is and is not.`,
    "",
  ]

  // A component page that lost its meta file would 404 from this index.
  for (const entry of entries) {
    if (!entry.data.component) continue
    const name = entry.id.replace(/^components\//, "")
    if (!componentNames.has(name)) {
      throw new Error(`llms.txt: ${entry.id} has no registry meta.`)
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
