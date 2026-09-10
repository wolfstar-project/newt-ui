/*
 * Roving tabindex for a radio group. A radio group is one tab stop, not one
 * per option: Tab reaches the selected row, and the arrow keys move the
 * selection between rows without leaving the group. Home and End jump to the
 * ends. That is the pattern a screen reader announces, and the one a keyboard
 * user expects from a native `<input type="radio">` set.
 */
document.querySelectorAll("[role='radiogroup']").forEach((group) => {
  const radios = () =>
    [...group.querySelectorAll("[role='radio']")].filter(
      (radio) => radio.getAttribute("aria-disabled") !== "true"
    )

  function select(radio, focus) {
    for (const other of group.querySelectorAll("[role='radio']")) {
      const chosen = other === radio
      other.setAttribute("aria-checked", String(chosen))
      other.tabIndex = chosen ? 0 : -1
    }
    if (focus) radio.focus()
    group.dispatchEvent(
      new CustomEvent("newt:change", {
        detail: { value: radio.dataset.value },
        bubbles: true,
      })
    )
  }

  group.addEventListener("click", (event) => {
    const radio = event.target.closest("[role='radio']")
    if (!radio || radio.getAttribute("aria-disabled") === "true") return
    select(radio, false)
  })

  group.addEventListener("keydown", (event) => {
    const options = radios()
    const current = options.indexOf(event.target.closest("[role='radio']"))
    if (current === -1) return

    // Space picks the focused row; the arrows move and pick in one step, which
    // is how a native radio group behaves.
    const next = {
      ArrowDown: current + 1,
      ArrowRight: current + 1,
      ArrowUp: current - 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: options.length - 1,
      " ": current,
    }[event.key]

    if (next === undefined) return
    event.preventDefault()
    select(options[(next + options.length) % options.length], true)
  })
})
