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
    (el) =>
      el.getAttribute("aria-label") === name || el.textContent?.trim() === name
  )
  if (!found) throw new Error(`Missing button: ${name}`)
  return found
}
function search(value: string) {
  const input = document.querySelector<HTMLInputElement>("[data-newt-search]")
  if (!input) throw new Error("Missing search")
  input.value = value
  input.dispatchEvent(new Event("input", { bubbles: true }))
}
function sectionTitles() {
  return [
    ...document.querySelectorAll(
      "[data-section] .newt-expressions-picker__title-label"
    ),
  ].map((title) => title.textContent?.trim())
}
function cells() {
  return [...document.querySelectorAll<HTMLButtonElement>("[data-cell]")]
}
function selections() {
  const found: unknown[] = []
  document.body.addEventListener("newt:expression-select", (event) => {
    if (event instanceof CustomEvent) found.push(event.detail)
  })
  return found
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
  it("groups emoji into recent, server, and Unicode sections", () => {
    button("Choose an expression").click()
    expect(sectionTitles()).toEqual([
      "Recently used",
      "Newt Lab",
      "Smileys & Emotion",
      "People & Body",
      "Symbols",
    ])
    expect(
      [...document.querySelectorAll("[data-newt-rail] button")].map((rail) =>
        rail.getAttribute("aria-label")
      )
    ).toEqual(sectionTitles())
  })

  it("searches every word across labels and keywords, and explains empty results", () => {
    button("Choose an expression").click()
    search(" HAPPY face ")
    expect(sectionTitles()).toEqual(["Search results"])
    expect(cells().map((cell) => cell.getAttribute("aria-label"))).toEqual([
      "grinning face",
    ])
    expect(
      document.querySelector<HTMLElement>("[data-newt-rail]")?.hidden
    ).toBe(true)
    search("not present")
    expect(cells()).toEqual([])
    expect(document.querySelector('[role="status"]')?.textContent).toContain(
      "Try another word or another tab"
    )
  })

  it("returns the value in the chosen skin tone and remembers it as recent", () => {
    const found = selections()
    button("Choose an expression").click()
    button("Skin tone: Default skin tone").click()
    button("Medium skin tone").click()
    search("thumbs")
    cells()[0]?.click()
    expect(found).toMatchObject([
      { item: { id: "thumbs-up" }, value: "👍🏽", recent: ["thumbs-up", "wave"] },
    ])
    expect(document.querySelector("dialog")?.open).toBe(false)
    expect(document.activeElement).toBe(button("Choose an expression"))

    button("Choose an expression").click()
    const recent = document.querySelector('[data-section="recent"]')
    expect(
      [...(recent?.querySelectorAll("[data-cell]") ?? [])].map((cell) =>
        cell.getAttribute("aria-label")
      )
    ).toEqual(["thumbs up", "waving hand"])
    expect(
      recent?.querySelector('[aria-pressed="true"]')?.getAttribute("aria-label")
    ).toBe("thumbs up")
  })

  it("collapses a section and keeps focus on the control that was used", () => {
    button("Choose an expression").click()
    const toggle = document.querySelector<HTMLButtonElement>(
      '[data-section="category-smileys"] h3 button'
    )
    toggle?.click()
    const again = document.querySelector<HTMLButtonElement>(
      '[data-section="category-smileys"] h3 button'
    )
    expect(again?.getAttribute("aria-expanded")).toBe("false")
    expect(document.activeElement).toBe(again)
    expect(
      document.querySelector('[data-section="category-smileys"] [data-cell]')
    ).toBeNull()
    button("Smileys & Emotion").click()
    expect(
      document.querySelector('[data-section="category-smileys"] [data-cell]')
    ).not.toBeNull()
    expect(document.activeElement).toBe(
      document.querySelector('[data-rail="category-smileys"]')
    )
  })

  it("keeps one cell in the tab order and skips unavailable entries", () => {
    button("Choose an expression").click()
    expect(
      cells()
        .filter((cell) => cell.tabIndex === 0)
        .map((cell) => cell.dataset.newtId)
    ).toEqual(["wave"])
    const moon = cells().find((cell) => cell.dataset.newtId === "moon")
    expect(moon?.disabled).toBe(true)
    expect(moon?.getAttribute("aria-label")).toBe("crescent moon, unavailable")
    moon?.click()
    expect(document.querySelector("dialog")?.open).toBe(true)
  })

  it("moves between types with the keyboard and hides the tone on media tabs", () => {
    button("Choose an expression").click()
    button("Emoji").dispatchEvent(
      new KeyboardEvent("keydown", { key: "Home", bubbles: true })
    )
    expect(document.activeElement).toBe(button("GIFs"))
    expect(sectionTitles()).toEqual(["Trending"])
    expect(
      document.querySelector<HTMLElement>("[data-newt-tone]")?.hidden
    ).toBe(true)
  })

  it("closes when the backdrop is clicked, not the panel", () => {
    button("Choose an expression").click()
    const dialog = document.querySelector("dialog")
    document
      .querySelector("[data-newt-scroll]")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    expect(dialog?.open).toBe(true)
    dialog?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
    expect(dialog?.open).toBe(false)
    expect(document.activeElement).toBe(button("Choose an expression"))
  })

  it("initializes multiple roots without duplicate IDs or listeners", () => {
    const firstId = document.querySelector("dialog")?.id
    document.body.insertAdjacentHTML("beforeend", markup)
    runInThisContext(behavior)
    const dialogs = [...document.querySelectorAll("dialog")]
    expect(dialogs[0]?.id).toBe(firstId)
    expect(new Set(dialogs.map((dialog) => dialog.id)).size).toBe(2)

    let opened = 0
    HTMLDialogElement.prototype.showModal = function () {
      opened += 1
      this.open = true
    }
    const found = selections()
    const triggers = [
      ...document.querySelectorAll<HTMLButtonElement>("[data-newt-trigger]"),
    ]
    triggers[0]?.click()
    expect(opened).toBe(1)
    expect(dialogs[0]?.open).toBe(true)
    expect(dialogs[1]?.open).toBe(false)
    dialogs[0]
      ?.querySelector<HTMLButtonElement>('[data-cell][tabindex="0"]')
      ?.click()
    expect(found).toHaveLength(1)

    triggers[1]?.click()
    expect(opened).toBe(2)
    expect(dialogs[1]?.open).toBe(true)
  })
})
