/*
 * The trigger toggles the panel. Escape and a press anywhere outside close
 * it. If focus was inside when Escape closed it, focus goes back to the
 * trigger, so a reader is never left on a control that has just disappeared.
 */
document.querySelectorAll("[data-newt-popover]").forEach((popover) => {
  const trigger = popover.querySelector(".newt-popover__trigger")
  const content = popover.querySelector(".newt-popover__content")
  if (!trigger || !content) return

  function setOpen(open) {
    content.hidden = !open
    trigger.setAttribute("aria-expanded", String(open))
    popover.dispatchEvent(
      new CustomEvent("newt:toggle", { detail: { open }, bubbles: true })
    )
  }

  trigger.addEventListener("click", () => setOpen(content.hidden))

  /*
   * On the document, not the popover: Escape has to work wherever focus is,
   * since some browsers do not focus a button on click. Handling it here also
   * keeps an enclosing dialog from closing on the same key.
   */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || content.hidden || event.defaultPrevented) {
      return
    }
    event.preventDefault()
    const focusInside = popover.contains(document.activeElement)
    setOpen(false)
    if (focusInside) trigger.focus()
  })

  document.addEventListener("pointerdown", (event) => {
    if (!content.hidden && !popover.contains(event.target)) setOpen(false)
  })
})
