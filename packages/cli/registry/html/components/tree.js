/*
 * The tree is one tab stop. Up and Down walk the visible rows, Right opens a
 * branch or steps into it, Left closes one or steps out to its parent, Home
 * and End jump to the ends. Enter, Space or a click selects a leaf and
 * toggles a branch. Selecting dispatches `newt:change` with the row's
 * `data-value`.
 */
document.querySelectorAll("[data-newt-tree]").forEach((tree) => {
  const items = () => [...tree.querySelectorAll("[role='treeitem']")]
  const visible = () => items().filter((item) => !item.hidden)
  const level = (item) => Number(item.getAttribute("aria-level"))
  const isBranch = (item) => item.hasAttribute("aria-expanded")
  const isOpen = (item) => item.getAttribute("aria-expanded") === "true"

  /* A row is shown when every branch above it is open. */
  function sync() {
    const open = []
    for (const item of items()) {
      const depth = level(item)
      open.length = depth - 1
      item.hidden = open.includes(false)
      if (isBranch(item)) open[depth - 1] = isOpen(item)
    }
  }

  function parentOf(item) {
    const all = items()
    for (let index = all.indexOf(item) - 1; index >= 0; index -= 1) {
      if (level(all[index]) < level(item)) return all[index]
    }
    return undefined
  }

  function focus(item) {
    if (!item) return
    for (const each of items()) each.tabIndex = each === item ? 0 : -1
    item.focus()
  }

  function toggle(item, open) {
    item.setAttribute("aria-expanded", String(open))
    sync()
  }

  function activate(item) {
    if (isBranch(item)) {
      toggle(item, !isOpen(item))
      return
    }
    for (const each of items()) {
      if (!isBranch(each)) {
        each.setAttribute("aria-selected", String(each === item))
      }
    }
    tree.dispatchEvent(
      new CustomEvent("newt:change", {
        detail: { value: item.dataset.value },
        bubbles: true,
      })
    )
  }

  tree.addEventListener("click", (event) => {
    const item = event.target.closest("[role='treeitem']")
    if (!item) return
    focus(item)
    activate(item)
  })

  tree.addEventListener("keydown", (event) => {
    const item = event.target.closest("[role='treeitem']")
    if (!item) return
    const rows = visible()
    const index = rows.indexOf(item)
    const forward = getComputedStyle(tree).direction === "rtl" ? -1 : 1
    const horizontal =
      event.key === "ArrowRight"
        ? forward
        : event.key === "ArrowLeft"
          ? -forward
          : 0

    if (event.key === "ArrowDown") focus(rows[index + 1])
    else if (event.key === "ArrowUp") focus(rows[index - 1])
    else if (event.key === "Home") focus(rows[0])
    else if (event.key === "End") focus(rows.at(-1))
    else if (event.key === "Enter" || event.key === " ") activate(item)
    else if (horizontal === 1) {
      if (isBranch(item) && !isOpen(item)) toggle(item, true)
      else if (isBranch(item)) focus(rows[index + 1])
    } else if (horizontal === -1) {
      if (isBranch(item) && isOpen(item)) toggle(item, false)
      else focus(parentOf(item))
    } else return
    event.preventDefault()
  })

  sync()
})
