import type { Heading, Root } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

/*
 * `## The token layer {#tokens}` keeps the id `tokens` instead of the one
 * Astro would derive from the words. Anchors published before this site was
 * rebuilt have to keep resolving, and a heading is free to be reworded without
 * breaking the links into it.
 *
 * MDX would otherwise read `{...}` as an expression, so the suffix is stripped
 * here, before the MDX parser sees the value.
 */
interface HeadingHast {
  hProperties?: { id?: string }
}

const TRAILING_ID = /\s*\{#([\w-]+)\}\s*$/

export const remarkHeadingId: Plugin<[], Root> = () => (tree) => {
  visit(tree, "heading", (node: Heading) => {
    const last = node.children.at(-1)
    if (last === undefined || last.type !== "text") return

    const match = TRAILING_ID.exec(last.value)
    if (match === null) return

    last.value = last.value.slice(0, match.index)
    // SAFETY: `hProperties` is how mdast-util-to-hast reads attributes off a
    // node. It is absent from mdast's own `HeadingData`, and writing it is the
    // documented way to set the id the HTML heading ends up with.
    const data = (node.data ??= {}) as HeadingHast
    data.hProperties = { ...data.hProperties, id: match[1] }
  })
}
