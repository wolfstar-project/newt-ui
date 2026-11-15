/*
 * Each `[data-newt-app-launcher]` launcher on the page is an open dialog. Focus
 * moves to its first control (or to the launcher itself when it has none).
 * Escape or a `[data-newt-app-launcher-close]` control asks to close it: the
 * launcher fires `newt:close`, then leaves the page and hands focus back to the
 * element that held it before. Cancel the event to close it your own way.
 *
 * Tab and Shift+Tab cycle through the controls of the launcher, as they do in
 * the React and Vue ports. Controls inside hidden content are skipped. A
 * press on the page beside it still moves focus there, and the launcher stays
 * open.
 *
 * With several launchers open, Escape closes one: the newest launcher that holds
 * focus, or else the newest launcher. Escape that a control inside already
 * handled (`event.preventDefault()`) closes nothing. The launcher marks the
 * Escape it handles the same way, so a surrounding dialog stays open.
 *
 * With `aria-modal="true"` focus cannot stay outside the launcher: Tab from the
 * page pulls it back in, and so does any other move of focus to the page. A
 * press outside closes the launcher, and the press is cancelled so it cannot
 * take focus from the element that gets it back.
 *
 * A launcher without the attribute is shown in the page: no script runs.
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

  /* The launchers this script opened, oldest first. */
  const opened = []
  const openLaunchers = () => opened.filter((launcher) => launcher.isConnected)
  /* The launcher that answers keys and presses: the newest that holds focus. */
  const activeLauncher = () => {
    const launchers = openLaunchers()
    return (
      launchers.findLast((launcher) =>
        launcher.contains(document.activeElement)
      ) ?? launchers.at(-1)
    )
  }
  const isModal = (launcher) => launcher.getAttribute("aria-modal") === "true"

  document.querySelectorAll("[data-newt-app-launcher]").forEach((launcher) => {
    /* A second include of the script leaves an opened launcher alone. */
    if (launcher.dataset.newtInitialized) return
    launcher.dataset.newtInitialized = "true"
    const modal = isModal(launcher)
    const active = document.activeElement
    /* An `autofocus` control inside has focus already: keep it, and there is
     * no outside element to hand focus back to. */
    const inside = launcher.contains(active)
    const opener = inside ? null : active
    /* The last control inside that held focus, to give it back to. */
    let lastFocused = inside ? active : null

    function release() {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("focusin", onFocusIn)
      const index = opened.indexOf(launcher)
      if (index !== -1) opened.splice(index, 1)
    }

    function close() {
      const event = new CustomEvent("newt:close", {
        bubbles: true,
        cancelable: true,
      })
      if (!launcher.dispatchEvent(event)) return
      launcher.remove()
      release()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }

    function onKeyDown(event) {
      if (!launcher.isConnected) {
        release()
        return
      }
      if (event.key !== "Escape" && event.key !== "Tab") return
      if (activeLauncher() !== launcher) return
      if (event.key === "Escape") {
        if (event.defaultPrevented) return
        event.preventDefault()
        close()
        return
      }
      const active = document.activeElement
      const inside = launcher.contains(active)
      /* Only a modal launcher takes focus back from the page beside it. */
      if (!inside && !modal) return
      const tabbables = tabbablesIn(launcher)
      const first = tabbables[0]
      const last = tabbables[tabbables.length - 1]
      if (first === undefined) {
        event.preventDefault()
        launcher.focus()
        return
      }
      if (
        event.shiftKey &&
        (!inside || active === first || active === launcher)
      ) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    function onPointerDown(event) {
      if (!launcher.isConnected) {
        release()
        return
      }
      if (!modal || activeLauncher() !== launcher) return
      if (launcher.contains(event.target)) return
      /* Without this the press would focus what it hit after `close` hands
       * focus back. */
      event.preventDefault()
      close()
    }

    /* A modal launcher takes focus back from the page, however it got there. */
    function onFocusIn(event) {
      if (!launcher.isConnected) {
        release()
        return
      }
      if (launcher.contains(event.target)) {
        lastFocused = event.target
        return
      }
      if (!modal || openLaunchers().findLast(isModal) !== launcher) return
      const target =
        lastFocused !== null &&
        launcher.contains(lastFocused) &&
        shown(lastFocused)
          ? lastFocused
          : (tabbablesIn(launcher)[0] ?? launcher)
      target.focus()
    }

    launcher.addEventListener("click", (event) => {
      if (event.target.closest("[data-newt-app-launcher-close]")) close()
    })
    opened.push(launcher)
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("focusin", onFocusIn)
    if (!inside) {
      const initial = tabbablesIn(launcher)[0] ?? launcher
      initial.focus()
    }
  })
}
