// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { beforeEach, describe, expect, it } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/spoiler.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/spoiler.js"),
  "utf8"
)

function spoiler() {
  const found = document.querySelector<HTMLElement>("[data-newt-spoiler]")
  if (!found) throw new Error("Missing spoiler")
  return found
}

function content() {
  const found = spoiler().querySelector(".newt-spoiler__content")
  if (!found) throw new Error("Missing spoiler content")
  return found
}

beforeEach(() => {
  document.body.innerHTML = markup
  runInThisContext(behavior)
})

describe("spoiler.js", () => {
  it("keeps hidden content inert behind a named button", () => {
    expect(content().hasAttribute("inert")).toBe(true)
    expect(spoiler().getAttribute("role")).toBe("button")
    expect(spoiler().getAttribute("aria-label")).toBe(
      "Spoiler, click to reveal"
    )
  })

  it.each(["Enter", " "])("reveals on %j", (key) => {
    spoiler().dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })
    )
    expect(content().hasAttribute("inert")).toBe(false)
    expect(spoiler().getAttribute("aria-expanded")).toBe("true")
    expect(spoiler().hasAttribute("role")).toBe(false)
    expect(spoiler().hasAttribute("tabindex")).toBe(false)
  })

  it("hides again on a second click, with its label restored", () => {
    spoiler().click()
    spoiler().click()
    expect(content().hasAttribute("inert")).toBe(true)
    expect(spoiler().getAttribute("role")).toBe("button")
    expect(spoiler().getAttribute("aria-label")).toBe(
      "Spoiler, click to reveal"
    )
  })
})
