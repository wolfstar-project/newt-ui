/*
 * The names default to English. Translate them with data attributes:
 * `data-newt-reveal-label` and `data-newt-hide-label` on the toggle,
 * `data-newt-copied-label` on the copy button.
 */
document.querySelectorAll("[data-newt-token-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.closest(".newt-token-field").querySelector("input")
    const revealed = input.type === "text"
    input.type = revealed ? "password" : "text"
    btn.textContent = revealed
      ? (btn.dataset.newtRevealLabel ?? "Reveal")
      : (btn.dataset.newtHideLabel ?? "Hide")
  })
})
document.querySelectorAll("[data-newt-token-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const input = btn.closest(".newt-token-field").querySelector("input")
    await navigator.clipboard.writeText(input.value)
    const original = btn.textContent
    btn.textContent = btn.dataset.newtCopiedLabel ?? "Copied!"
    setTimeout(() => (btn.textContent = original), 1500)
  })
})
