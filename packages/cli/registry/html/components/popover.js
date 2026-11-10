/*
 * The trigger toggles the panel. Escape and a press anywhere outside close
 * it, and closing with the keyboard hands focus back to the trigger, so a
 * reader is never left on a control that has just disappeared.
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

  popover.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || content.hidden) return
    event.stopPropagation()
    setOpen(false)
    trigger.focus()
  })

  document.addEventListener("pointerdown", (event) => {
    if (!content.hidden && !popover.contains(event.target)) setOpen(false)
  })
})
