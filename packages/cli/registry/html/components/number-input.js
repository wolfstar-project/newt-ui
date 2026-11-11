/*
 * The buttons call the input's own `stepUp` and `stepDown`, so `min`, `max`
 * and `step` are enforced in one place, then fire the `input` event a
 * keystroke would have. A stepper that has nowhere left to go is disabled.
 */
document.querySelectorAll("[data-newt-number]").forEach((field) => {
  const input = field.querySelector(".newt-number__input")
  if (!input) return
  const steppers = [...field.querySelectorAll("[data-newt-number-step]")]

  function sync() {
    const value = Number(input.value)
    for (const stepper of steppers) {
      const up = Number(stepper.dataset.newtNumberStep) > 0
      const bound = up ? input.max : input.min
      stepper.disabled =
        input.disabled ||
        (bound !== "" && (up ? value >= Number(bound) : value <= Number(bound)))
    }
  }

  for (const stepper of steppers) {
    stepper.addEventListener("click", () => {
      if (input.value === "") input.value = input.min || "0"
      else if (Number(stepper.dataset.newtNumberStep) > 0) input.stepUp()
      else input.stepDown()
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
  }

  input.addEventListener("input", sync)
  sync()
})
