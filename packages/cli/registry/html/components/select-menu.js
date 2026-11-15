/*
 * Combobox behaviour for `.newt-select-menu`.
 *
 * Focus never leaves the trigger: the open listbox is driven through
 * `aria-activedescendant`, which is what lets Escape, Tab and click-outside
 * stay simple. Keys: Arrow up/down, Home, End, Enter, Space, Escape.
 *
 * `data-side="top"` on the root opens the panel above the trigger. Either
 * side gives way to the other when it has no room.
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

  /*
   * The panel opens on the side the root asks for, and flips when it would
   * run past the viewport there and the other side has more room.
   */
  const place = () => {
    const box = trigger.getBoundingClientRect()
    const above = box.top
    const below = window.innerHeight - box.bottom
    const height = panel.offsetHeight
    const opensAbove =
      root.dataset.side === "top"
        ? !(above < height && below > above)
        : below < height && above > below
    panel.dataset.placement = opensAbove ? "above" : "below"
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
      /* A row may hold more than its label, so the label is read by name. */
      const label = option.querySelector(".newt-select-menu__option-label")
      value.textContent = (label ?? option).textContent.trim()
      value.classList.remove("newt-select-menu__value--placeholder")
    }
    /*
     * The trigger emoji follows the chosen row. It is made when a row has one
     * and removed when the next row has none, so the markup can leave it out.
     */
    const chosen = option.querySelector(".newt-select-menu__option-emoji")
    let emoji = trigger.querySelector(".newt-select-menu__emoji")
    if (chosen) {
      if (!emoji) {
        emoji = document.createElement("span")
        emoji.className = "newt-select-menu__emoji"
        emoji.setAttribute("aria-hidden", "true")
        if (value) value.before(emoji)
        else trigger.prepend(emoji)
      }
      emoji.textContent = chosen.textContent
    } else if (emoji) {
      emoji.remove()
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
