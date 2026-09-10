import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

import { pathFor } from "../lib/docs"
import { SITE } from "../lib/site"

/*
 * Every page in one file, for an agent with a large context that would rather
 * read the documentation once than fetch it a page at a time.
 */
export const GET: APIRoute = async () => {
  const entries = (await getCollection("docs")).toSorted((a, b) =>
    a.id.localeCompare(b.id)
  )

  const documents = entries.map((entry) =>
    [
      `# ${entry.data.title}`,
      "",
      `Source: ${SITE.url}${pathFor(entry.id)}`,
      "",
      `> ${entry.data.description}`,
      "",
      (entry.body ?? "").replace(/\s*\\\{#[\w-]+\\\}\s*$/gm, ""),
    ].join("\n")
  )

  const body = [
    `# ${SITE.name} — full documentation`,
    "",
    `> ${SITE.tagline}. Generated from ${entries.length} pages.`,
    "",
    ...documents,
  ].join("\n\n---\n\n")

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
