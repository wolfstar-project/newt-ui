/*
 * The range input owns the value; this only mirrors it into the custom
 * property the drawing is placed by. `input` fires for the mouse, touch and
 * the keyboard alike, so there is one listener and no pointer maths.
 */
document.querySelectorAll("[data-newt-slider]").forEach((slider) => {
  const input = slider.querySelector(".newt-slider__input")
  if (!input) return

  function sync() {
    const min = Number(input.min || 0)
    const max = Number(input.max || 100)
    const ratio = max === min ? 0 : (Number(input.value) - min) / (max - min)
    slider.style.setProperty("--newt-slider-ratio", String(ratio))
  }

  input.addEventListener("input", sync)
  sync()
})
