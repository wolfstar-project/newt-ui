import { defineHastPlugin } from "satteri"

/*
 * `## The token layer {#tokens}` keeps the id `tokens` instead of the one
 * Astro derives from the words. Anchors published before this site was rebuilt
 * have to keep resolving, and a heading is free to be reworded without breaking
 * the links into it.
 *
 * This runs on the HTML tree rather than the Markdown one, so it sets the `id`
 * attribute directly and overrides the slug Astro injects into every heading.
 * MDX reads `{...}` as an expression, so content escapes the braces
 * (`\{#tokens\}`); by the time the tree is built they are literal text again,
 * which is what this matches.
 */
const TRAILING_ID = /\s*\{#([\w-]+)\}\s*$/

export const hastHeadingId = defineHastPlugin({
  name: "newt-heading-id",
  element: {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    visit(node, ctx) {
      const last = node.children.at(-1)
      if (last === undefined || last.type !== "text") return

      const match = TRAILING_ID.exec(last.value)
      if (match === null) return

      const id = match[1]
      if (id === undefined) return

      ctx.setProperty(node, "id", id)
      ctx.replaceNode(last, {
        type: "text",
        value: last.value.slice(0, match.index),
      })
    },
  },
})
