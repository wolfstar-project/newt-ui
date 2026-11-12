/*
 * Each `[data-newt-modal]` overlay on the page is an open modal. While it is
 * open it owns the keyboard: focus moves to its first control (or the dialog
 * itself when it has none), Tab and Shift+Tab cycle inside it, and Escape, a
 * press of the overlay or a `[data-newt-modal-close]` control removes it and
 * hands focus back to the element that held it before.
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

  document.querySelectorAll("[data-newt-modal]").forEach((overlay) => {
    const dialog = overlay.querySelector("[role='dialog']") ?? overlay
    const active = document.activeElement
    /* An `autofocus` control inside has focus already: keep it, and there is
     * no outside element to hand focus back to. */
    const inside = dialog.contains(active)
    const opener = inside ? null : active

    function close() {
      overlay.remove()
      document.removeEventListener("keydown", onKeyDown)
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        close()
        return
      }
      if (event.key !== "Tab") return
      const tabbables = tabbablesIn(dialog)
      const first = tabbables[0]
      const last = tabbables[tabbables.length - 1]
      const active = document.activeElement
      if (first === undefined) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const inside = dialog.contains(active)
      if (
        event.shiftKey &&
        (!inside || active === first || active === dialog)
      ) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    overlay.addEventListener("click", (event) => {
      if (
        event.target === overlay ||
        event.target.closest("[data-newt-modal-close]")
      ) {
        close()
      }
    })
    document.addEventListener("keydown", onKeyDown)
    if (!inside) {
      const initial = tabbablesIn(dialog)[0] ?? dialog
      initial.focus()
    }
  })
}
