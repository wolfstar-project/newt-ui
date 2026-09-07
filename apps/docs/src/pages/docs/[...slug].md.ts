import type { APIRoute, GetStaticPaths } from "astro"
import { getCollection, type CollectionEntry } from "astro:content"

import { findComponent, targetPaths } from "../../lib/registry"

/*
 * The markdown twin of every docs page. An agent handed `/docs/components/
 * button.md` gets the same content the reader sees without the chrome, the
 * islands or the HTML, which is what makes `llms.txt` and the copy-page menu
 * useful rather than decorative.
 *
 * The MDX tags that stand in for registry-driven sections are expanded here
 * into the facts they render, so the twin states the install command and the
 * files rather than leaving a tag the reader cannot resolve.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("docs")
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }))
}

/** `## Heading \{#id\}` is an escaped literal in the source; drop the suffix. */
function stripHeadingIds(markdown: string): string {
  return markdown.replace(/\s*\\\{#[\w-]+\\\}\s*$/gm, "")
}

function expandComponentTags(markdown: string, name: string): string {
  const meta = findComponent(name)
  if (meta === undefined) return markdown

  const react = targetPaths("react", meta)
  const vue = targetPaths("vue", meta)
  const dependencies =
    meta.dependencies.length > 0
      ? `\n\nnpm dependencies: ${meta.dependencies.join(", ")}.`
      : ""
  const registryDependencies =
    meta.registryDependencies.length > 0
      ? ` Registry dependencies, installed with it: ${meta.registryDependencies.join(", ")}.`
      : ""

  return markdown
    .replace(
      /<ComponentPreview[^/]*\/>/g,
      `_Live example of ${meta.title} — see the page for the rendered demo._`
    )
    .replace(
      /<Installation[^/]*\/>/g,
      `\`\`\`bash\nnpx newtui@latest add ${meta.name}\n\`\`\`${dependencies}${registryDependencies}\n\nFiles written — React: ${react.join(", ")}. Vue: ${vue.join(", ")}.`
    )
    .replace(
      /<Usage[^/]*\/>/g,
      `Import from your ui alias, e.g. \`@/components/ui/${meta.name}\`.`
    )
    .replace(
      /<TokensNote[^/]*\/>/g,
      `${meta.title} reads its colours, radii and motion from the \`--newt-*\` tokens. Override a token rather than editing the component.`
    )
}

export const GET: APIRoute<{ entry: CollectionEntry<"docs"> }> = ({
  props,
}) => {
  const { entry } = props

  let markdown = stripHeadingIds(entry.body ?? "")
  if (entry.data.component) {
    markdown = expandComponentTags(
      markdown,
      entry.id.replace(/^components\//, "")
    )
  }

  const body = [
    `# ${entry.data.title}`,
    "",
    `> ${entry.data.description}`,
    "",
    markdown,
  ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
