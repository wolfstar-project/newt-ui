// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { beforeEach, describe, expect, it } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/expressions-picker.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/expressions-picker.js"),
  "utf8"
)

function button(name: string) {
  const found = [...document.querySelectorAll("button")].find(
    (el) => el.textContent?.trim() === name
  )
  if (!found) throw new Error(`Missing button: ${name}`)
  return found
}
function search(value: string) {
  const input = document.querySelector("input")
  if (!input) throw new Error("Missing search")
  input.value = value
  input.dispatchEvent(new Event("input", { bubbles: true }))
}
function results() {
  return [...document.querySelectorAll<HTMLLIElement>("li")]
    .filter((row) => !row.hidden)
    .map((row) => row.textContent?.trim())
}

beforeEach(() => {
  document.body.innerHTML = markup
  // jsdom has no top layer. This adapter only models open/close events;
  // real browser coverage verifies modal focus containment and Escape.
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function () {
    this.open = false
    this.dispatchEvent(new Event("close"))
  }
  runInThisContext(behavior)
})

describe("HTML expressions picker", () => {
  it("filters aliases case-insensitively and explains empty results", () => {
    button("Choose an expression").click()
    search(" HAPPY ")
    expect(results()).toEqual(["😀Smile"])
    search("not present")
    expect(results()).toEqual([])
    expect(document.querySelector('[role="status"]')?.textContent).toContain(
      "Try another search or type"
    )
  })

  it("emits the selected item and restores trigger focus", () => {
    const selections: unknown[] = []
    document.body.addEventListener(
      "newt:expression-select",
      (event) => {
        if (event instanceof CustomEvent) selections.push(event.detail)
      },
      { once: true }
    )
    button("Choose an expression").click()
    button("Stickers").click()
    button("Hello sticker").click()
    expect(selections).toEqual([
      {
        id: "hello-sticker",
        kind: "sticker",
        label: "Hello sticker",
        value: "hello-sticker",
        keywords: [],
      },
    ])
    expect(document.querySelector("dialog")?.open).toBe(false)
    expect(document.activeElement).toBe(button("Choose an expression"))
  })

  it("does not select unavailable entries", () => {
    button("Choose an expression").click()
    const unavailable = document.querySelector<HTMLButtonElement>(
      "button[data-newt-id='moon']"
    )
    unavailable?.click()
    expect(document.querySelector("dialog")?.open).toBe(true)
    expect(unavailable?.disabled).toBe(true)
  })

  it("moves between types with the keyboard and clears search on reopen", () => {
    button("Choose an expression").click()
    button("Emoji").dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true })
    )
    expect(document.activeElement).toBe(button("GIFs"))
    expect(results()).toEqual(["Celebration GIF"])
    search("missing")
    document.querySelector<HTMLDialogElement>("dialog")?.close()
    button("Choose an expression").click()
    expect(results()).toEqual(["Celebration GIF"])
  })

  it("initializes multiple roots without duplicate IDs or listeners", () => {
    document.body.insertAdjacentHTML("beforeend", markup)
    runInThisContext(behavior)
    const dialogs = [...document.querySelectorAll("dialog")]
    expect(new Set(dialogs.map((dialog) => dialog.id)).size).toBe(2)
    const triggers = [
      ...document.querySelectorAll<HTMLButtonElement>("[data-newt-trigger]"),
    ]
    triggers[1]?.click()
    expect(dialogs[0]?.open).toBe(false)
    expect(dialogs[1]?.open).toBe(true)
  })
})
