// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { beforeEach, describe, expect, it } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/modal.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/modal.js"),
  "utf8"
)

function button(name: string) {
  const found = [...document.querySelectorAll("button")].find(
    (el) => el.textContent?.trim() === name
  )
  if (!found) throw new Error(`Missing button: ${name}`)
  return found
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

let opener: HTMLButtonElement

beforeEach(() => {
  document.body.innerHTML = `<button id="opener">Open</button>${markup}`
  const found = document.querySelector<HTMLButtonElement>("#opener")
  if (!found) throw new Error("Missing opener")
  opener = found
  opener.focus()
  runInThisContext(behavior)
})

describe("modal.js", () => {
  it("moves focus to the dialog's first control when it opens", () => {
    expect(document.activeElement).toBe(button("Cancel"))
  })

  it("wraps Tab from the last control to the first", () => {
    button("Confirm").focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(button("Cancel"))
  })

  it("wraps Shift+Tab from the first control to the last", () => {
    const event = press("Tab", true)
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(button("Confirm"))
  })

  it("brings focus back inside when it has left the dialog", () => {
    opener.focus()
    press("Tab")
    expect(document.activeElement).toBe(button("Cancel"))
  })

  it("closes on Escape and returns focus to the element that opened it", () => {
    press("Escape")
    expect(document.querySelector("[data-newt-modal]")).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it("leaves focus on a control inside that already holds it", () => {
    document.body.innerHTML = markup
    button("Confirm").focus()
    runInThisContext(behavior)
    expect(document.activeElement).toBe(button("Confirm"))
  })

  it("returns focus after a close control too", () => {
    button("Cancel").click()
    expect(document.querySelector("[data-newt-modal]")).toBeNull()
    expect(document.activeElement).toBe(opener)
  })
})
