/*
 * Typing narrows the list to the rows whose text holds the query; the arrow
 * keys move the highlight through what is left; Enter or a
 * click dispatches `newt:select` with the row's `data-value` and closes the
 * palette. A control with `data-newt-command-palette-open="<id>"` opens one.
 */
document
  .querySelectorAll("[data-newt-command-palette-open]")
  .forEach((opener) => {
    opener.addEventListener("click", () => {
      const palette = document.getElementById(
        opener.dataset.newtCommandPaletteOpen
      )
      if (palette instanceof HTMLDialogElement && !palette.open) {
        palette.showModal()
      }
    })
  })

document.querySelectorAll("[data-newt-command-palette]").forEach((palette) => {
  const input = palette.querySelector(".newt-command-palette__input")
  const empty = palette.querySelector(".newt-command-palette__empty")
  if (!input) return

  const options = () => [
    ...palette.querySelectorAll(".newt-command-palette__option"),
  ]
  const shown = () => options().filter((option) => !option.hidden)

  function highlight(option) {
    for (const each of options()) {
      each.setAttribute("aria-selected", String(each === option))
    }
    if (option) {
      input.setAttribute("aria-activedescendant", option.id)
      option.scrollIntoView({ block: "nearest" })
    } else {
      input.removeAttribute("aria-activedescendant")
    }
  }

  function filter() {
    const query = input.value.trim().toLowerCase()
    for (const option of options()) {
      option.hidden = !option.textContent.toLowerCase().includes(query)
    }
    for (const group of palette.querySelectorAll(
      ".newt-command-palette__group"
    )) {
      group.hidden =
        group.querySelector(".newt-command-palette__option:not([hidden])") ===
        null
    }
    const rest = shown()
    if (empty) empty.hidden = rest.length > 0
    highlight(rest[0])
  }

  function select(option) {
    palette.dispatchEvent(
      new CustomEvent("newt:select", {
        detail: { value: option.dataset.value },
        bubbles: true,
      })
    )
    palette.close()
  }

  input.addEventListener("input", filter)

  input.addEventListener("keydown", (event) => {
    // While an input method is composing, Enter confirms a candidate.
    if (event.isComposing) return
    const rest = shown()
    const current = rest.findIndex(
      (option) => option.getAttribute("aria-selected") === "true"
    )
    if (event.key === "Enter") {
      event.preventDefault()
      if (rest[current]) select(rest[current])
      return
    }
    const next = {
      ArrowDown: (current + 1) % rest.length,
      ArrowUp: (current - 1 + rest.length) % rest.length,
    }[event.key]
    if (next === undefined || rest.length === 0) return
    event.preventDefault()
    highlight(rest[next])
  })

  palette.addEventListener("click", (event) => {
    const option = event.target.closest(".newt-command-palette__option")
    if (option) select(option)
    else if (event.target === palette) palette.close()
  })

  /* Every opening starts from an empty query. */
  palette.addEventListener("close", () => {
    input.value = ""
    filter()
  })
})
