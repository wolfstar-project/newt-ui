// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { beforeEach, describe, expect, it } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/tag-input.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/tag-input.js"),
  "utf8"
)

/* A block of its own, since the script declares a top-level `const`. */
function run() {
  runInThisContext(`{${behavior}}`)
}

function field() {
  const found = document.querySelector<HTMLElement>("[data-newt-tag-input]")
  if (!found) throw new Error("Missing tag input")
  return found
}

function type(text: string) {
  const input = field().querySelector<HTMLInputElement>(
    ".newt-tag-input__input"
  )
  if (!input) throw new Error("Missing input")
  input.value = text
  input.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
  )
}

function removeLabels() {
  return [...field().querySelectorAll(".newt-tag-input__remove")].map(
    (button) => button.getAttribute("aria-label")
  )
}

beforeEach(() => {
  document.body.innerHTML = markup
})

describe("tag-input.js", () => {
  it("names a new chip's remove button in English by default", () => {
    run()
    type("voice")
    expect(removeLabels().at(-1)).toBe("Remove voice")
  })

  it("builds the name from data-newt-remove-label", () => {
    field().dataset.newtRemoveLabel = "Retirer {tag}"
    run()
    type("voice")
    expect(removeLabels().at(-1)).toBe("Retirer voice")
  })
})
