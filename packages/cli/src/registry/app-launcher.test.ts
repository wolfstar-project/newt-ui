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

function launchers() {
  return [...document.querySelectorAll<HTMLElement>(".newt-app-launcher")]
}

function pressOn(target: Element) {
  const event = new MouseEvent("pointerdown", {
    bubbles: true,
    cancelable: true,
  })
  target.dispatchEvent(event)
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

  it("keeps the launcher open when a control inside handles Escape", () => {
    control("Poll Night").addEventListener("keydown", (event) => {
      if (event.key === "Escape") event.preventDefault()
    })
    control("Poll Night").focus()
    press("Escape")
    expect(launcher()).not.toBeNull()
  })

  it("marks the Escape it handles, so a surrounding dialog stays open", () => {
    const event = press("Escape")
    expect(event.defaultPrevented).toBe(true)
  })

  it("stays open when the page beside it is pressed", () => {
    opener.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))
    expect(launcher()).not.toBeNull()
  })
})

describe("app-launcher.js, with hidden controls", () => {
  beforeEach(() => {
    open((found) => {
      const hidden = `<div hidden><button>Hidden</button></div><div style="display: none"><button>Not displayed</button></div>`
      found.insertAdjacentHTML("afterbegin", hidden)
      found.insertAdjacentHTML("beforeend", hidden)
    })
  })

  it("moves focus to the first control that is shown", () => {
    expect(document.activeElement).toBe(control("Search apps"))
  })

  it("wraps Tab past controls inside hidden content", () => {
    control("Poll Night").focus()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Search apps"))
  })

  it("wraps Shift+Tab past controls inside hidden content", () => {
    const event = press("Tab", true)
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Poll Night"))
  })
})

describe("app-launcher.js, with two launchers open", () => {
  beforeEach(() => {
    document.body.innerHTML = `<button id="opener">Apps</button>${markup}${markup}`
    document.querySelector<HTMLButtonElement>("#opener")?.focus()
    runInThisContext(behavior)
  })

  it("closes only the launcher that holds focus on Escape", () => {
    const [first, second] = launchers()
    first?.querySelector("button")?.focus()
    press("Escape")
    expect(launchers()).toEqual([second])
  })

  it("closes only the newest launcher on Escape from the page", () => {
    const [first] = launchers()
    document.querySelector<HTMLButtonElement>("#opener")?.focus()
    press("Escape")
    expect(launchers()).toEqual([first])
  })
})

describe("app-launcher.js, as a modal dialog", () => {
  let opener: HTMLButtonElement

  beforeEach(() => {
    opener = open((found) => found.setAttribute("aria-modal", "true"))
  })

  it("pulls focus back in on Tab once focus has left it", () => {
    control("Search apps").blur()
    const event = press("Tab")
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(control("Search apps"))
  })

  it("closes when the page beside it is pressed", () => {
    pressOn(opener)
    expect(launcher()).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it("cancels the press outside, so the press cannot move focus off the opener", () => {
    const event = pressOn(document.body)
    expect(event.defaultPrevented).toBe(true)
  })

  it("takes focus back when the page beside it takes focus", () => {
    control("Moderation bot").focus()
    opener.focus()
    expect(document.activeElement).toBe(control("Moderation bot"))
  })

  it("lets the page take focus again once it closes", () => {
    press("Escape")
    document.body.insertAdjacentHTML(
      "beforeend",
      '<button id="other">Other</button>'
    )
    document.querySelector<HTMLButtonElement>("#other")?.focus()
    expect(document.activeElement?.id).toBe("other")
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

describe("app-launcher.js, included twice", () => {
  it("fires newt:close once per close", () => {
    open()
    runInThisContext(behavior)
    let closes = 0
    launcher()?.addEventListener("newt:close", () => {
      closes += 1
    })
    control("Moderation bot").setAttribute("data-newt-app-launcher-close", "")
    control("Moderation bot").click()
    expect(closes).toBe(1)
  })
})
