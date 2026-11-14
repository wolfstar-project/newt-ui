// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/scrollbar.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/scrollbar.js"),
  "utf8"
)

function part(selector: string) {
  const found = document.querySelector<HTMLElement>(selector)
  if (!found) throw new Error(`Missing ${selector}`)
  return found
}

/** jsdom lays nothing out, so a test states the sizes a browser would. */
function size(element: HTMLElement, sizes: Record<string, number>) {
  for (const [name, value] of Object.entries(sizes)) {
    Object.defineProperty(element, name, { configurable: true, value })
  }
}

/** The thumb is as long as its inline height unless the stylesheet caps it. */
function thumbLength(maximum = Infinity) {
  const thumb = part(".newt-scrollbar__thumb")
  Object.defineProperty(thumb, "offsetHeight", {
    configurable: true,
    get: () => Math.min(Number.parseFloat(thumb.style.height) || 0, maximum),
  })
}

/** Reports at once, as a browser does for an element it starts to observe. */
function resizeObserver(report: () => void) {
  return { observe: report, disconnect: () => undefined }
}

function scrollTo(top: number) {
  const viewport = part(".newt-scrollbar__viewport")
  viewport.scrollTop = top
  viewport.dispatchEvent(new Event("scroll"))
}

function pointer(type: string, clientY: number) {
  part(".newt-scrollbar__thumb").dispatchEvent(
    new MouseEvent(type, { button: 0, clientY, cancelable: true })
  )
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal("ResizeObserver", resizeObserver)
  document.body.innerHTML = markup
  size(part(".newt-scrollbar__viewport"), {
    clientHeight: 200,
    scrollHeight: 800,
  })
  size(part(".newt-scrollbar__track"), { clientHeight: 180 })
  part(".newt-scrollbar__thumb").setPointerCapture = vi.fn()
  thumbLength()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("scrollbar.js, overlay thumb", () => {
  it("is as long as the share of the content the viewport shows", () => {
    runInThisContext(behavior)
    expect(part(".newt-scrollbar__track").hidden).toBe(false)
    expect(part(".newt-scrollbar__thumb").style.height).toBe("45px")
    expect(part(".newt-scrollbar__thumb").style.transform).toBe(
      "translateY(0px)"
    )
  })

  it("travels the track as the content scrolls", () => {
    runInThisContext(behavior)
    scrollTo(300)
    expect(part(".newt-scrollbar__thumb").style.transform).toBe(
      "translateY(67.5px)"
    )
  })

  it("still reaches the end of the track when its length is capped", () => {
    thumbLength(40)
    runInThisContext(behavior)
    scrollTo(600)
    expect(part(".newt-scrollbar__thumb").style.transform).toBe(
      "translateY(140px)"
    )
  })

  it("hides the track when the content fits", () => {
    size(part(".newt-scrollbar__viewport"), { scrollHeight: 200 })
    runInThisContext(behavior)
    expect(part(".newt-scrollbar__track").hidden).toBe(true)
  })

  it("scrolls the content while the thumb is dragged, and stops on release", () => {
    runInThisContext(behavior)
    pointer("pointerdown", 100)
    pointer("pointermove", 127)
    expect(part(".newt-scrollbar__viewport").scrollTop).toBe(120)
    pointer("lostpointercapture", 127)
    pointer("pointermove", 154)
    expect(part(".newt-scrollbar__viewport").scrollTop).toBe(120)
  })
})

describe("scrollbar.js, auto-hide", () => {
  it("marks the area while it scrolls and clears the mark 800ms later", () => {
    runInThisContext(behavior)
    const root = part(".newt-scrollbar--overlay")
    expect(root.hasAttribute("data-scrolling")).toBe(false)
    scrollTo(300)
    expect(root.hasAttribute("data-scrolling")).toBe(true)
    vi.advanceTimersByTime(799)
    expect(root.hasAttribute("data-scrolling")).toBe(true)
    vi.advanceTimersByTime(1)
    expect(root.hasAttribute("data-scrolling")).toBe(false)
  })

  it("keeps the mark for as long as the thumb is held", () => {
    runInThisContext(behavior)
    const root = part(".newt-scrollbar--overlay")
    pointer("pointerdown", 100)
    vi.advanceTimersByTime(5000)
    expect(root.hasAttribute("data-scrolling")).toBe(true)
    pointer("lostpointercapture", 100)
    vi.advanceTimersByTime(800)
    expect(root.hasAttribute("data-scrolling")).toBe(false)
  })

  it("marks a native scroller, which has no thumb to draw", () => {
    document.body.innerHTML = `<div class="newt-scrollbar newt-scrollbar--auto-hide" data-newt-scrollbar></div>`
    runInThisContext(behavior)
    const scroller = part(".newt-scrollbar")
    scroller.dispatchEvent(new Event("scroll"))
    expect(scroller.hasAttribute("data-scrolling")).toBe(true)
  })

  it("leaves an area that does not auto-hide unmarked", () => {
    const root = part(".newt-scrollbar--overlay")
    root.classList.remove("newt-scrollbar--auto-hide")
    runInThisContext(behavior)
    scrollTo(300)
    expect(root.hasAttribute("data-scrolling")).toBe(false)
  })
})
