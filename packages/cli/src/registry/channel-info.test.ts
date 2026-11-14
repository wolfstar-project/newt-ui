// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { beforeEach, describe, expect, it } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/channel-info.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/channel-info.js"),
  "utf8"
)

function control(name: string) {
  const found = [...document.querySelectorAll("button")].find(
    (el) => (el.getAttribute("aria-label") ?? el.textContent?.trim()) === name
  )
  if (!found) throw new Error(`Missing control: ${name}`)
  return found
}

function panel() {
  return document.querySelector<HTMLElement>(".newt-channel-info")
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

/** The page: a control that holds focus, then the panel, opened by `edit`. */
function open(edit: (panel: HTMLElement) => void = () => undefined) {
  document.body.innerHTML = `<button id="opener">Details</button>${markup}`
  const opener = document.querySelector<HTMLButtonElement>("#opener")
  const found = panel()
  if (!opener || !found) throw new Error("Missing opener or panel")
  edit(found)
  opener.focus()
  runInThisContext(behavior)
  return opener
}

describe("channel-info.js, as a dialog", () => {
  let opener: HTMLButtonElement

  beforeEach(() => {
    opener = open()
  })

  it("moves focus to the panel's first control when it opens", () => {
    expect(document.activeElement).toBe(control("Back to channel"))
  })

  it("closes on Escape and returns focus to the element that opened it", () => {
    press("Escape")
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it("closes from a close control and returns focus", () => {
    control("Back to channel").click()
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it("stays on the page when a listener cancels the close", () => {
    panel()?.addEventListener("newt:close", (event) => event.preventDefault())
    press("Escape")
    expect(panel()).not.toBeNull()
  })

  it("wraps Tab from the last control to the first", () => {
    control("Members").focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Back to channel"))
  })

  it("wraps Shift+Tab from the first control to the last", () => {
    const event = press("Tab", true)
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Members"))
  })

  it("leaves Tab alone while focus is on the page beside it", () => {
    opener.focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(opener)
  })

  it("stays open when the page beside it is pressed", () => {
    opener.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
    expect(panel()).not.toBeNull()
  })
})

describe("channel-info.js, as a modal dialog", () => {
  let opener: HTMLButtonElement

  beforeEach(() => {
    opener = open((found) => found.setAttribute("aria-modal", "true"))
  })

  it("wraps Tab from the last control to the first", () => {
    control("Members").focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Back to channel"))
  })

  it("pulls focus back in on Tab from the page beside it", () => {
    opener.focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Back to channel"))
  })

  it("closes when the page beside it is pressed", () => {
    opener.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
    expect(panel()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })
})

describe("channel-info.js, inline", () => {
  it("leaves focus where it is and ignores Escape", () => {
    const opener = open((found) => {
      found.removeAttribute("data-newt-channel-info")
      found.removeAttribute("role")
    })
    press("Escape")
    expect(document.activeElement).toBe(opener)
    expect(panel()).not.toBeNull()
  })
})
