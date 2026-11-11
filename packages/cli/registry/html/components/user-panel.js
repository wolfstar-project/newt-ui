/*
 * A toggle button flips its own `aria-pressed` and reports the new state with
 * `newt:toggle`. What muting actually does is the application's business.
 */
document
  .querySelectorAll(".newt-user-panel [data-newt-toggle]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const pressed = button.getAttribute("aria-pressed") !== "true"
      button.setAttribute("aria-pressed", String(pressed))
      button.dispatchEvent(
        new CustomEvent("newt:toggle", { detail: { pressed }, bubbles: true })
      )
    })
  })
