import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

import { parseNamespaced, SHADCN_BRIDGE_ITEM } from "./namespaces.js"

/*
 * The bridge is a list of references to newt/ui tokens. A token renamed in
 * `tokens.css` would leave a shadcn colour pointing at nothing, silently.
 */
const declared = new Set(
  readFileSync(
    resolve(import.meta.dirname, "../../registry/html/tokens.css"),
    "utf8"
  ).match(/--newt-[a-z0-9-]+(?=:)/g)
)

describe("the shadcn colour bridge", () => {
  it("only references tokens that exist", () => {
    const tokens = [
      ...new Set(
        JSON.stringify(SHADCN_BRIDGE_ITEM).match(/--newt-[a-z0-9-]+/g)
      ),
    ]
    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens.filter((token) => !declared.has(token))).toEqual([])
  })
})

describe("parseNamespaced", () => {
  it("splits a namespace from an item that may carry slashes", () => {
    expect(parseNamespaced("@magicui/marquee")).toEqual({
      namespace: "@magicui",
      item: "marquee",
    })
    expect(parseNamespaced("@acme/blocks/hero")).toEqual({
      namespace: "@acme",
      item: "blocks/hero",
    })
  })

  it("leaves bare names and URLs alone", () => {
    expect(parseNamespaced("button")).toBeUndefined()
    expect(parseNamespaced("https://example.com/r/button.json")).toBeUndefined()
    expect(parseNamespaced("@/button")).toBeUndefined()
  })
})
