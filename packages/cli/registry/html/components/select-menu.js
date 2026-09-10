/*
 * Combobox behaviour for `.newt-select-menu`.
 *
 * Focus never leaves the trigger: the open listbox is driven through
 * `aria-activedescendant`, which is what lets Escape, Tab and click-outside
 * stay simple. Keys: Arrow up/down, Home, End, Enter, Space, Escape.
 */
document.querySelectorAll("[data-newt-select]").forEach((root) => {
  const trigger = root.querySelector(".newt-select-menu__trigger")
  const panel = root.querySelector(".newt-select-menu__panel")
  const value = root.querySelector(".newt-select-menu__value")
  const options = [...root.querySelectorAll(".newt-select-menu__option")]
  if (!trigger || !panel || options.length === 0) return

  let active = -1

  const selectable = (index) =>
    options[index] && options[index].getAttribute("aria-disabled") !== "true"

  const setActive = (index) => {
    active = index
    options.forEach((option, i) => {
      option.classList.toggle("newt-select-menu__option--active", i === index)
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

  const open = () => {
    if (trigger.disabled || panel.hidden === false) return
    panel.hidden = false
    trigger.setAttribute("aria-expanded", "true")
    place()
    const selected = options.findIndex(
      (option) => option.getAttribute("aria-selected") === "true"
    )
    setActive(
      selected >= 0 && selectable(selected) ? selected : firstSelectable()
    )
  }

  const close = () => {
    if (panel.hidden) return
    panel.hidden = true
    trigger.setAttribute("aria-expanded", "false")
    setActive(-1)
  }

  const select = (index) => {
    const option = options[index]
    if (!option || !selectable(index)) return
    options.forEach((other) => {
      const isChosen = other === option
      other.setAttribute("aria-selected", String(isChosen))
      other.classList.toggle("newt-select-menu__option--selected", isChosen)
    })
    if (value) {
      value.textContent = option.textContent.trim()
      value.classList.remove("newt-select-menu__value--placeholder")
    }
    root.dispatchEvent(
      new CustomEvent("newt-select", {
        bubbles: true,
        detail: { value: option.dataset.value },
      })
    )
    close()
    trigger.focus()
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
        panel.hidden ? open() : select(active)
        return
      }
      case "Escape":
        if (panel.hidden) return
        event.preventDefault()
        close()
    }
  })

  options.forEach((option, index) => {
    /* Keep the trigger focused so aria-activedescendant stays authoritative. */
    option.addEventListener("mousedown", (event) => event.preventDefault())
    option.addEventListener("mouseenter", () => {
      if (selectable(index)) setActive(index)
    })
    option.addEventListener("click", () => select(index))
  })

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) close()
  })

  window.addEventListener("resize", () => {
    if (!panel.hidden) place()
  })
})
