/*
 * Each `[data-newt-channel-info]` panel on the page is an open dialog. Focus
 * moves to its first control (or to the panel itself when it has none).
 * Escape or a `[data-newt-channel-info-close]` control asks to close it: the
 * panel fires `newt:close`, then leaves the page and hands focus back to the
 * element that held it before. Cancel the event to close it your own way.
 *
 * Tab and Shift+Tab cycle through the controls of the panel, as they do in
 * the React and Vue ports. Controls inside hidden content are skipped. A
 * press on the page beside it still moves focus there, and the panel stays
 * open.
 *
 * With several panels open, Escape closes one: the newest panel that holds
 * focus, or else the newest panel. Escape that a control inside already
 * handled (`event.preventDefault()`) closes nothing. The panel marks the
 * Escape it handles the same way, so a surrounding dialog stays open.
 *
 * With `aria-modal="true"` focus cannot stay outside the panel: Tab from the
 * page pulls it back in, and so does any other move of focus to the page. A
 * press outside closes the panel, and the press is cancelled so it cannot
 * take focus from the element that gets it back.
 *
 * A panel without the attribute is an inline side panel: no script runs.
 */

/* A block, so the script can be included twice without redeclaring. Each
 * element is set up once, so a second include adds no listeners. */
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

  /* A control that is hidden, by itself or by an ancestor, takes no focus. */
  const shown = (element) => {
    if (typeof element.checkVisibility === "function") {
      return element.checkVisibility({
        checkVisibilityCSS: true,
        visibilityProperty: true,
      })
    }
    /* Engines without `checkVisibility`: walk up to the root. */
    for (let node = element; node; node = node.parentElement) {
      if (node.hidden || getComputedStyle(node).display === "none") return false
    }
    return getComputedStyle(element).visibility !== "hidden"
  }

  const tabbablesIn = (container) =>
    [...container.querySelectorAll(FOCUSABLE)].filter(
      (element) =>
        element.tabIndex >= 0 && !element.closest("[inert]") && shown(element)
    )

  /* The panels this script opened, oldest first. */
  const opened = []
  const openPanels = () => opened.filter((panel) => panel.isConnected)
  /* The panel that answers keys and presses: the newest that holds focus. */
  const activePanel = () => {
    const panels = openPanels()
    return (
      panels.findLast((panel) => panel.contains(document.activeElement)) ??
      panels.at(-1)
    )
  }
  const isModal = (panel) => panel.getAttribute("aria-modal") === "true"

  document.querySelectorAll("[data-newt-channel-info]").forEach((panel) => {
    /* A second include of the script leaves an opened panel alone. */
    if (panel.dataset.newtInitialized) return
    panel.dataset.newtInitialized = "true"
    const modal = isModal(panel)
    const active = document.activeElement
    /* An `autofocus` control inside has focus already: keep it, and there is
     * no outside element to hand focus back to. */
    const inside = panel.contains(active)
    const opener = inside ? null : active
    /* The last control inside that held focus, to give it back to. */
    let lastFocused = inside ? active : null

    function release() {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("focusin", onFocusIn)
      const index = opened.indexOf(panel)
      if (index !== -1) opened.splice(index, 1)
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
      if (event.key !== "Escape" && event.key !== "Tab") return
      if (activePanel() !== panel) return
      if (event.key === "Escape") {
        if (event.defaultPrevented) return
        event.preventDefault()
        close()
        return
      }
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
      if (!modal || activePanel() !== panel) return
      if (panel.contains(event.target)) return
      /* Without this the press would focus what it hit after `close` hands
       * focus back. */
      event.preventDefault()
      close()
    }

    /* A modal panel takes focus back from the page, however it got there. */
    function onFocusIn(event) {
      if (!panel.isConnected) {
        release()
        return
      }
      if (panel.contains(event.target)) {
        lastFocused = event.target
        return
      }
      if (!modal || openPanels().findLast(isModal) !== panel) return
      const target =
        lastFocused !== null &&
        panel.contains(lastFocused) &&
        shown(lastFocused)
          ? lastFocused
          : (tabbablesIn(panel)[0] ?? panel)
      target.focus()
    }

    panel.addEventListener("click", (event) => {
      if (event.target.closest("[data-newt-channel-info-close]")) close()
    })
    opened.push(panel)
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("focusin", onFocusIn)
    if (!inside) {
      const initial = tabbablesIn(panel)[0] ?? panel
      initial.focus()
    }
  })
}
