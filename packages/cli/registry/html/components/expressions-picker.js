/* Load with defer, after the picker markup. Safe to load again for new roots. */
document.querySelectorAll("[data-newt-expressions-picker]").forEach((root) => {
  if (root.dataset.newtInitialized) return
  const trigger = root.querySelector("[data-newt-trigger]")
  const dialog = root.querySelector("[data-newt-dialog]")
  const search = root.querySelector("[data-newt-search]")
  const results = root.querySelector("[data-newt-results]")
  const status = root.querySelector("[data-newt-status]")
  const close = root.querySelector("[data-newt-close]")
  if (!trigger || !dialog || !search || !results || !status || !close) return
  root.dataset.newtInitialized = "true"
  const id = `newt-expressions-${crypto.randomUUID()}`
  dialog.id = id
  results.id = `${id}-results`
  trigger.setAttribute("aria-controls", id)
  const tabs = [...root.querySelectorAll('[role="tab"]')]
  const items = [...root.querySelectorAll("[data-newt-expression]")]
  let kind = "emoji"
  function render() {
    const query = search.value.trim().toLowerCase()
    let count = 0
    items.forEach((item) => {
      const matches =
        item.dataset.newtKind === kind &&
        `${item.dataset.newtLabel} ${item.dataset.newtKeywords ?? ""}`
          .toLowerCase()
          .includes(query)
      item.closest("[data-newt-expression-row]").hidden = !matches
      if (matches) count += 1
    })
    tabs.forEach((tab) => {
      const selected = tab.dataset.newtKind === kind
      tab.setAttribute("aria-selected", String(selected))
      tab.tabIndex = selected ? 0 : -1
      if (selected) results.setAttribute("aria-labelledby", tab.id)
    })
    status.textContent = count
      ? `${count} expressions`
      : "No expressions found. Try another search or type."
  }
  tabs.forEach((tab, index) => {
    tab.id = `${id}-${tab.dataset.newtKind}`
    tab.setAttribute("aria-controls", results.id)
    tab.addEventListener("click", () => {
      kind = tab.dataset.newtKind
      render()
    })
    tab.addEventListener("keydown", (event) => {
      const rtl = getComputedStyle(tab).direction === "rtl"
      const step =
        event.key === "ArrowRight"
          ? rtl
            ? -1
            : 1
          : event.key === "ArrowLeft"
            ? rtl
              ? 1
              : -1
            : 0
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? 2
            : step
              ? (index + step + 3) % 3
              : -1
      if (next < 0) return
      event.preventDefault()
      tabs[next].click()
      tabs[next].focus()
    })
  })
  trigger.addEventListener("click", () => {
    if (trigger.disabled) return
    search.value = ""
    render()
    dialog.showModal()
    trigger.setAttribute("aria-expanded", "true")
    search.focus()
  })
  close.addEventListener("click", () => dialog.close())
  dialog.addEventListener("close", () => {
    trigger.setAttribute("aria-expanded", "false")
    trigger.focus()
  })
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return
    const controls = [
      ...dialog.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), [tabindex="0"]'
      ),
    ].filter(
      (element) => element.tabIndex >= 0 && element.getClientRects().length > 0
    )
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  })
  search.addEventListener("input", render)
  items.forEach((item) =>
    item.addEventListener("click", () => {
      if (trigger.disabled || item.disabled) return
      dialog.close()
      root.dispatchEvent(
        new CustomEvent("newt:expression-select", {
          bubbles: true,
          detail: {
            id: item.dataset.newtId,
            kind: item.dataset.newtKind,
            label: item.dataset.newtLabel,
            value: item.dataset.newtValue,
            keywords: (item.dataset.newtKeywords ?? "")
              .split(" ")
              .filter(Boolean),
            ...(item.querySelector("img")
              ? { previewSrc: item.querySelector("img").getAttribute("src") }
              : {}),
          },
        })
      )
    })
  )
  render()
})
