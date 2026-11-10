/*
 * Two inputs, one value. Picking a swatch or closing the colour dialog
 * dispatches `newt:change` with the hex; the dialog's choice also repaints
 * the custom tile and clears the palette, so only one of them reads as
 * chosen.
 */
document.querySelectorAll("[data-newt-color-picker]").forEach((picker) => {
  const custom = picker.querySelector(".newt-color-picker__custom")
  const native = picker.querySelector(".newt-color-picker__native")

  function announce(value) {
    picker.dispatchEvent(
      new CustomEvent("newt:change", { detail: { value }, bubbles: true })
    )
  }

  picker.addEventListener("change", (event) => {
    const radio = event.target.closest(".newt-color-picker__input")
    if (!radio) return
    custom?.classList.remove("newt-color-picker__custom--active")
    custom?.style.removeProperty("--newt-swatch")
    announce(radio.value)
  })

  native?.addEventListener("input", () => {
    custom.style.setProperty("--newt-swatch", native.value)
    custom.classList.add("newt-color-picker__custom--active")
    for (const radio of picker.querySelectorAll(".newt-color-picker__input")) {
      radio.checked = false
    }
    announce(native.value)
  })
})
