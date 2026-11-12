/*
 * Reveals a `[data-newt-spoiler]` on a click, Enter or Space. Revealed, it is
 * plain text again: no longer a button, out of the tab order, and its content
 * stops being inert. A click on revealed text hides it again.
 */
function setRevealed(spoiler, revealed) {
  spoiler.classList.toggle("newt-spoiler--revealed", revealed)
  spoiler.setAttribute("aria-expanded", String(revealed))
  const content = spoiler.querySelector(".newt-spoiler__content")
  content?.toggleAttribute("inert", !revealed)
  if (revealed) {
    spoiler.dataset.newtLabel = spoiler.getAttribute("aria-label") ?? ""
    spoiler.removeAttribute("role")
    spoiler.removeAttribute("tabindex")
    spoiler.removeAttribute("aria-label")
  } else {
    spoiler.setAttribute("role", "button")
    spoiler.setAttribute("tabindex", "0")
    spoiler.setAttribute("aria-label", spoiler.dataset.newtLabel ?? "")
  }
}

document.querySelectorAll("[data-newt-spoiler]").forEach((spoiler) => {
  spoiler.addEventListener("click", () => {
    setRevealed(spoiler, !spoiler.classList.contains("newt-spoiler--revealed"))
  })
  spoiler.addEventListener("keydown", (event) => {
    if (spoiler.classList.contains("newt-spoiler--revealed")) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setRevealed(spoiler, true)
    }
  })
})
