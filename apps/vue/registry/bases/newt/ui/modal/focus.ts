/*
 * A modal dialog owns the keyboard while it is open: focus moves into it,
 * Tab and Shift+Tab cycle through its controls without reaching the page
 * behind, and closing hands focus back to whatever held it before.
 */

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex='-1'])",
].join(",")

/** The controls Tab can reach inside `container`, in tab order. */
export function tabbablesIn(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => {
      if (element.tabIndex < 0 || element.closest("[inert]")) return false
      const style = getComputedStyle(element)
      return style.visibility !== "hidden" && style.display !== "none"
    }
  )
}

/** Keeps a Tab press inside `container`, wrapping at either end. */
export function containTab(event: KeyboardEvent, container: HTMLElement) {
  const tabbables = tabbablesIn(container)
  const first = tabbables[0]
  const last = tabbables[tabbables.length - 1]
  const active = document.activeElement
  if (first === undefined || last === undefined) {
    event.preventDefault()
    container.focus()
    return
  }
  const inside = active instanceof Node && container.contains(active)
  if (event.shiftKey && (!inside || active === first || active === container)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (!inside || active === last)) {
    event.preventDefault()
    first.focus()
  }
}
