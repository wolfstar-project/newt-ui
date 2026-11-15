// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { beforeEach, describe, expect, it } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/app-launcher.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/app-launcher.js"),
  "utf8"
)

function control(name: string) {
  const found = [
    ...document.querySelectorAll<HTMLElement>("button, input"),
  ].find((el) =>
    (
      el.getAttribute("aria-label") ??
      el.querySelector(".newt-app-launcher__item-name")?.textContent ??
      el.textContent ??
      ""
    )
      .trim()
      .startsWith(name)
  )
  if (!found) throw new Error(`Missing control: ${name}`)
  return found
}

function launcher() {
  return document.querySelector<HTMLElement>(".newt-app-launcher")
}

function press(key: string, shiftKey = false) {
  const event = new KeyboardEvent("keydown", {
    key,
    shiftKey,
    bubbles: true,
    cancelable: true,
  })
  ;(document.activeElement ?? document.body).dispatchEvent(event)
  return event
}

/** The page: a control that holds focus, then the launcher, opened by `edit`. */
function open(edit: (launcher: HTMLElement) => void = () => undefined) {
  document.body.innerHTML = `<button id="opener">Apps</button>${markup}`
  const opener = document.querySelector<HTMLButtonElement>("#opener")
  const found = launcher()
  if (!opener || !found) throw new Error("Missing opener or launcher")
  edit(found)
  opener.focus()
  runInThisContext(behavior)
  return opener
}

describe("app-launcher.js, as a dialog", () => {
  let opener: HTMLButtonElement

  beforeEach(() => {
    opener = open()
  })

  it("moves focus to the search field when it opens", () => {
    expect(document.activeElement).toBe(control("Search apps"))
  })

  it("closes on Escape and returns focus to the element that opened it", () => {
    press("Escape")
    expect(launcher()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it("closes from a close control and returns focus", () => {
    control("Moderation bot").setAttribute("data-newt-app-launcher-close", "")
    control("Moderation bot").click()
    expect(launcher()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it("stays on the page when a listener cancels the close", () => {
    launcher()?.addEventListener("newt:close", (event) =>
      event.preventDefault()
    )
    press("Escape")
    expect(launcher()).not.toBeNull()
  })

  it("wraps Tab from the last control to the first", () => {
    control("Poll Night").focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Search apps"))
  })

  it("wraps Shift+Tab from the first control to the last", () => {
    const event = press("Tab", true)
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Poll Night"))
  })

  it("stays open when the page beside it is pressed", () => {
    opener.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
    expect(launcher()).not.toBeNull()
  })
})

describe("app-launcher.js, as a modal dialog", () => {
  let opener: HTMLButtonElement

  beforeEach(() => {
    opener = open((found) => found.setAttribute("aria-modal", "true"))
  })

  it("pulls focus back in on Tab from the page beside it", () => {
    opener.focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Search apps"))
  })

  it("closes when the page beside it is pressed", () => {
    opener.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
    expect(launcher()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })
})

describe("app-launcher.js, inline", () => {
  it("leaves focus where it is and ignores Escape", () => {
    const opener = open((found) => {
      found.removeAttribute("data-newt-app-launcher")
      found.removeAttribute("role")
    })
    press("Escape")
    expect(document.activeElement).toBe(opener)
    expect(launcher()).not.toBeNull()
  })
})
