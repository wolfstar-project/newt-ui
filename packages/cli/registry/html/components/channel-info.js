/*
 * Each `[data-newt-channel-info]` panel on the page is an open dialog. Focus
 * moves to its first control (or to the panel itself when it has none).
 * Escape or a `[data-newt-channel-info-close]` control asks to close it: the
 * panel fires `newt:close`, then leaves the page and hands focus back to the
 * element that held it before. Cancel the event to close it your own way.
 *
 * Tab and Shift+Tab cycle through the controls of the panel, as they do in
 * the React and Vue ports. A press on the page beside it still moves focus
 * there, and the panel stays open.
 *
 * With `aria-modal="true"` focus cannot stay outside the panel: Tab from the
 * page pulls it back in, and a press outside closes the panel.
 *
 * A panel without the attribute is an inline side panel: no script runs.
 */

/* A block, so the script can be included twice without redeclaring. */
{
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

  const tabbablesIn = (container) =>
    [...container.querySelectorAll(FOCUSABLE)].filter((element) => {
      if (element.tabIndex < 0 || element.closest("[inert]")) return false
      const style = getComputedStyle(element)
      return style.visibility !== "hidden" && style.display !== "none"
    })

  document.querySelectorAll("[data-newt-channel-info]").forEach((panel) => {
    const modal = panel.getAttribute("aria-modal") === "true"
    const active = document.activeElement
    /* An `autofocus` control inside has focus already: keep it, and there is
     * no outside element to hand focus back to. */
    const inside = panel.contains(active)
    const opener = inside ? null : active

    function release() {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }

    function close() {
      const event = new CustomEvent("newt:close", {
        bubbles: true,
        cancelable: true,
      })
      if (!panel.dispatchEvent(event)) return
      panel.remove()
      release()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }

    function onKeyDown(event) {
      if (!panel.isConnected) {
        release()
        return
      }
      if (event.key === "Escape") {
        close()
        return
      }
      if (event.key !== "Tab") return
      const active = document.activeElement
      const inside = panel.contains(active)
      /* Only a modal panel takes focus back from the page beside it. */
      if (!inside && !modal) return
      const tabbables = tabbablesIn(panel)
      const first = tabbables[0]
      const last = tabbables[tabbables.length - 1]
      if (first === undefined) {
        event.preventDefault()
        panel.focus()
        return
      }
      if (event.shiftKey && (!inside || active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    function onPointerDown(event) {
      if (!panel.isConnected) {
        release()
        return
      }
      if (modal && !panel.contains(event.target)) close()
    }

    panel.addEventListener("click", (event) => {
      if (event.target.closest("[data-newt-channel-info-close]")) close()
    })
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    if (!inside) {
      const initial = tabbablesIn(panel)[0] ?? panel
      initial.focus()
    }
  })
}
