/*
 * Combobox + chip behaviour for `.newt-entity-select`.
 *
 * Focus never leaves the trigger: the open listbox is driven through
 * `aria-activedescendant`, same as `.newt-select-menu`. Where this differs is
 * the selection itself — above `data-max="1"` the chosen rows leave the list
 * and sit in the trigger as removable chips instead of replacing a single
 * value, so toggling never closes the panel and Backspace on the (closed)
 * trigger drops the most recent chip.
 */
document.querySelectorAll("[data-newt-entity-select]").forEach((root) => {
  const trigger = root.querySelector(".newt-entity-select__trigger")
  const panel = root.querySelector(".newt-entity-select__panel")
  const values = root.querySelector(".newt-entity-select__values")
  const options = [...root.querySelectorAll(".newt-entity-select__option")]
  if (!trigger || !panel || !values || options.length === 0) return

  const max = Number(root.dataset.max) || 1
  const multiple = max > 1
  const placeholder = root.dataset.placeholder || "Make a selection"

  let active = -1
  let selected = options
    .filter((option) => option.getAttribute("aria-selected") === "true")
    .map((option) => option.dataset.value)

  const selectable = (index) =>
    options[index] && options[index].getAttribute("aria-disabled") !== "true"

  const setActive = (index) => {
    active = index
    options.forEach((option, i) => {
      option.classList.toggle("newt-entity-select__option--active", i === index)
    })
    const current = options[index]
    if (current) {
      trigger.setAttribute("aria-activedescendant", current.id)
      current.scrollIntoView({ block: "nearest" })
    } else {
      trigger.removeAttribute("aria-activedescendant")
    }
  }

  const step = (from, direction) => {
    for (let i = 1; i <= options.length; i++) {
      const index = (from + direction * i + options.length * i) % options.length
      if (selectable(index)) return index
    }
    return from
  }

  const firstSelectable = () => options.findIndex((_, i) => selectable(i))

  const lastSelectable = () => {
    for (let i = options.length - 1; i >= 0; i--) if (selectable(i)) return i
    return -1
  }

  /* Flip above the trigger when the panel would run past the viewport. */
  const place = () => {
    const box = trigger.getBoundingClientRect()
    const below = window.innerHeight - box.bottom
    panel.dataset.placement =
      below < panel.offsetHeight && box.top > below ? "above" : "below"
  }

  const rowLabel = (option) => {
    const label = option.querySelector(".newt-entity-select__label")
    return {
      text: label ? label.textContent.trim() : option.dataset.value,
      color: label ? label.style.color : "",
    }
  }

  /* Rebuilds the trigger's contents from `selected` — a placeholder, the
   * single chosen row, or one removable chip per row — so the trigger never
   * drifts from the option list it was derived from. */
  const renderValues = () => {
    values.replaceChildren()
    const chosen = options.filter((option) =>
      selected.includes(option.dataset.value)
    )

    if (chosen.length === 0) {
      const empty = document.createElement("span")
      empty.className = "newt-entity-select__placeholder"
      empty.textContent = placeholder
      values.append(empty)
      return
    }

    if (!multiple) {
      const { text, color } = rowLabel(chosen[0])
      const span = document.createElement("span")
      span.textContent = text
      if (color) span.style.color = color
      values.append(span)
      return
    }

    chosen.forEach((option) => {
      const { text, color } = rowLabel(option)
      const chip = document.createElement("span")
      chip.className = "newt-entity-select__chip"

      const label = document.createElement("span")
      label.textContent = text
      if (color) label.style.color = color
      chip.append(label)

      const close = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      )
      close.setAttribute("viewBox", "0 0 24 24")
      close.setAttribute("aria-hidden", "true")
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )
      path.setAttribute("fill", "currentColor")
      path.setAttribute(
        "d",
        "M7.05 5.64a1 1 0 0 1 1.41 0L12 9.17l3.54-3.53a1 1 0 1 1 1.41 1.41L13.41 10.6l3.54 3.53a1 1 0 0 1-1.41 1.42L12 12.01l-3.54 3.54a1 1 0 0 1-1.41-1.42l3.53-3.53-3.53-3.54a1 1 0 0 1 0-1.42Z"
      )
      close.append(path)
      chip.append(close)

      /* Keep the trigger focused, same as an option row: a mousedown here
       * must never steal focus before the click removes the chip. */
      chip.addEventListener("mousedown", (event) => {
        event.preventDefault()
        event.stopPropagation()
        selected = selected.filter((value) => value !== option.dataset.value)
        commit()
      })

      values.append(chip)
    })
  }

  const commit = () => {
    options.forEach((option) => {
      const isChosen = selected.includes(option.dataset.value)
      option.setAttribute("aria-selected", String(isChosen))
      option.classList.toggle("newt-entity-select__option--selected", isChosen)
    })
    renderValues()
    root.dispatchEvent(
      new CustomEvent("newt-select", {
        bubbles: true,
        detail: { value: multiple ? selected : (selected[0] ?? null) },
      })
    )
  }

  const open = () => {
    if (trigger.disabled || panel.hidden === false) return
    panel.hidden = false
    trigger.setAttribute("aria-expanded", "true")
    place()
    const current = options.findIndex((option) =>
      selected.includes(option.dataset.value)
    )
    setActive(current >= 0 && selectable(current) ? current : firstSelectable())
  }

  const close = () => {
    if (panel.hidden) return
    panel.hidden = true
    trigger.setAttribute("aria-expanded", "false")
    setActive(-1)
  }

  const toggle = (index) => {
    const option = options[index]
    if (!option || !selectable(index)) return
    const value = option.dataset.value

    if (!multiple) {
      selected = [value]
      commit()
      close()
      trigger.focus()
      return
    }

    /* At the limit the list stays open and stops taking more, rather than
     * silently dropping the oldest choice. */
    const already = selected.includes(value)
    if (!already && selected.length >= max) return
    selected = already
      ? selected.filter((each) => each !== value)
      : [...selected, value]
    commit()
  }

  trigger.addEventListener("click", () => {
    panel.hidden ? open() : close()
  })

  trigger.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault()
        if (panel.hidden) {
          open()
          return
        }
        setActive(step(active, event.key === "ArrowDown" ? 1 : -1))
        return
      }
      case "Home":
        if (panel.hidden) return
        event.preventDefault()
        setActive(firstSelectable())
        return
      case "End":
        if (panel.hidden) return
        event.preventDefault()
        setActive(lastSelectable())
        return
      case "Enter":
      case " ": {
        event.preventDefault()
        panel.hidden ? open() : toggle(active)
        return
      }
      case "Escape":
        if (panel.hidden) return
        event.preventDefault()
        close()
        return
      case "Backspace": {
        /* The chip nearest the caret goes first, which is the last one. */
        if (!multiple || !panel.hidden || selected.length === 0) return
        event.preventDefault()
        selected = selected.slice(0, -1)
        commit()
      }
    }
  })

  options.forEach((option, index) => {
    /* Keep the trigger focused so aria-activedescendant stays authoritative. */
    option.addEventListener("mousedown", (event) => event.preventDefault())
    option.addEventListener("mouseenter", () => {
      if (selectable(index)) setActive(index)
    })
    option.addEventListener("click", () => toggle(index))
  })

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) close()
  })

  window.addEventListener("resize", () => {
    if (!panel.hidden) place()
  })

  renderValues()
})
