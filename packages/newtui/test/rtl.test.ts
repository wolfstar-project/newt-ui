import { describe, expect, it } from "vitest"

import { rewriteRtl } from "../src/tools/rtl.js"

describe("rewriteRtl", () => {
  it("rewrites margins, padding, borders and radii", () => {
    expect(rewriteRtl("ml-2 pr-4 border-l-2 rounded-tl-md").code).toBe(
      "ms-2 pe-4 border-s-2 rounded-ss-md"
    )
  })

  it("rewrites text alignment, which names the value rather than the side", () => {
    expect(rewriteRtl("text-left text-right").code).toBe("text-start text-end")
  })

  it("rewrites inset offsets", () => {
    expect(rewriteRtl("absolute left-0 right-[6px]").code).toBe(
      "absolute start-0 end-[6px]"
    )
  })

  it("keeps variants and negation in front of the utility", () => {
    expect(
      rewriteRtl("hover:ml-1 before:-left-2 md:group-hover:pr-3").code
    ).toBe("hover:ms-1 before:-start-2 md:group-hover:pe-3")
  })

  it("leaves a bare word alone: a utility always has a value", () => {
    expect(rewriteRtl("flex items-center leftover").code).toBe(
      "flex items-center leftover"
    )
  })

  it("does not touch an identifier that merely contains the prefix", () => {
    expect(rewriteRtl("const marginLeft = 4").code).toBe("const marginLeft = 4")
  })

  it("is idempotent: the outputs are not inputs of any rule", () => {
    const once = rewriteRtl("ml-2 rounded-l-md text-left").code
    expect(rewriteRtl(once).code).toBe(once)
  })

  it("converts space-x to gap and flags it, since the two are not identical", () => {
    const result = rewriteRtl("flex space-x-2")
    expect(result.code).toBe("flex gap-2")
    expect(result.changes.join(" ")).toContain("check the layout")
  })

  it("reports nothing when there is nothing to change", () => {
    expect(rewriteRtl("flex ms-2 pe-4").changes).toEqual([])
  })
})
