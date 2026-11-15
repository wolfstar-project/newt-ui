// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { runInThisContext } from "node:vm"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const markup = readFileSync(
  resolve("registry/html/components/token-field.html"),
  "utf8"
)
const behavior = readFileSync(
  resolve("registry/html/components/token-field.js"),
  "utf8"
)

function control(name: "toggle" | "copy") {
  const found = document.querySelector<HTMLButtonElement>(
    `[data-newt-token-${name}]`
  )
  if (!found) throw new Error(`Missing ${name} button`)
  return found
}

beforeEach(() => {
  document.body.innerHTML = markup
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn(() => Promise.resolve()) },
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe("token-field.js", () => {
  it("names the toggle in English by default", () => {
    runInThisContext(behavior)
    control("toggle").click()
    expect(control("toggle").textContent).toBe("Hide")
    control("toggle").click()
    expect(control("toggle").textContent).toBe("Reveal")
  })

  it("reads the toggle's names from its data attributes", () => {
    control("toggle").dataset.newtRevealLabel = "Afficher"
    control("toggle").dataset.newtHideLabel = "Masquer"
    runInThisContext(behavior)
    control("toggle").click()
    expect(control("toggle").textContent).toBe("Masquer")
    control("toggle").click()
    expect(control("toggle").textContent).toBe("Afficher")
  })

  it("reads the copied text from its data attribute, then restores", async () => {
    vi.useFakeTimers()
    control("copy").textContent = "Copier"
    control("copy").dataset.newtCopiedLabel = "Copié !"
    runInThisContext(behavior)
    control("copy").click()
    await vi.waitFor(() => expect(control("copy").textContent).toBe("Copié !"))
    vi.runAllTimers()
    expect(control("copy").textContent).toBe("Copier")
  })
})
