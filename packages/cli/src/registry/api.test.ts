import { describe, expect, it } from "vitest"

import { getRegistryUrl } from "./api.js"

describe("getRegistryUrl", () => {
  it("defaults to the published registry for each framework", () => {
    expect(getRegistryUrl("react")).toBe("https://newtui.dev/r")
    expect(getRegistryUrl("vue")).toBe("https://newtui.dev/vue/r")
  })

  it("prefers an explicit override over the default", () => {
    expect(getRegistryUrl("react", "https://acme.dev/r")).toBe(
      "https://acme.dev/r"
    )
  })

  it("strips trailing slashes, so item paths never double up", () => {
    expect(getRegistryUrl("react", "https://acme.dev/r///")).toBe(
      "https://acme.dev/r"
    )
  })
})
