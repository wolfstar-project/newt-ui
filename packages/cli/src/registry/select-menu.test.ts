// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { beforeEach, describe, expect, it } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/select-menu.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/select-menu.js"),
  "utf8"
)

function trigger() {
  const found = document.querySelector<HTMLElement>(
    ".newt-select-menu__trigger"
  )
  if (!found) throw new Error("Missing select-menu trigger")
  return found
}

function choose(value: string) {
  const option = document.querySelector<HTMLElement>(
    `.newt-select-menu__option[data-value="${value}"]`
  )
  if (!option) throw new Error(`Missing option ${value}`)
  trigger().click()
  option.click()
}

function triggerEmoji() {
  return trigger().querySelector<HTMLElement>(".newt-select-menu__emoji")
}

beforeEach(() => {
  document.body.innerHTML = markup
  /* jsdom does not lay out, so it has no scrollIntoView. */
  Element.prototype.scrollIntoView = () => {}
  runInThisContext(behavior)
})

describe("select-menu.js", () => {
  it("shows the emoji of the chosen option on a trigger without one", () => {
    expect(triggerEmoji()).toBeNull()
    choose("two")
    expect(triggerEmoji()?.textContent).toBe("🎲")
    expect(triggerEmoji()?.getAttribute("aria-hidden")).toBe("true")
  })

  it("removes the trigger emoji when the next option has none", () => {
    choose("two")
    choose("one")
    expect(triggerEmoji()).toBeNull()
    expect(
      trigger().querySelector(".newt-select-menu__value")?.textContent
    ).toBe("Option one")
  })
})
