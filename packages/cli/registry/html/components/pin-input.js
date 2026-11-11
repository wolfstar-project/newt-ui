/*
 * Typing fills a box and moves on; Backspace empties one and moves back; a
 * paste is dealt out from the box it landed in. When every box is full the
 * group dispatches `newt:complete` with the code.
 */
document.querySelectorAll("[data-newt-pin]").forEach((group) => {
  const cells = () => [...group.querySelectorAll(".newt-pin__cell")]
  const numeric = group.dataset.newtPin !== "text"
  const accept = (text) =>
    [...text].filter((char) =>
      numeric ? /\d/.test(char) : /[a-z0-9]/i.test(char)
    )

  function announce() {
    const value = cells()
      .map((cell) => cell.value)
      .join("")
    group.dispatchEvent(
      new CustomEvent("newt:change", { detail: { value }, bubbles: true })
    )
    if (value.length === cells().length) {
      group.dispatchEvent(
        new CustomEvent("newt:complete", { detail: { value }, bubbles: true })
      )
    }
  }

  /*
   * Deal characters out from `from`, or from the first empty box when that
   * comes sooner, so the code never has a gap; then rest on the next box.
   */
  function fill(from, chars) {
    const all = cells()
    const empty = all.findIndex((cell) => cell.value === "")
    const start = empty === -1 ? from : Math.min(from, empty)
    chars.slice(0, all.length - start).forEach((char, offset) => {
      all[start + offset].value = char
    })
    const next = Math.min(start + chars.length, all.length - 1)
    all[next].focus()
    all[next].select()
    announce()
  }

  group.addEventListener("input", (event) => {
    const cell = event.target.closest(".newt-pin__cell")
    if (!cell) return
    const chars = accept(cell.value)
    cell.value = ""
    if (chars.length > 0) fill(cells().indexOf(cell), chars)
    else announce()
  })

  group.addEventListener("paste", (event) => {
    const cell = event.target.closest(".newt-pin__cell")
    if (!cell) return
    event.preventDefault()
    const chars = accept(event.clipboardData?.getData("text") ?? "")
    if (chars.length > 0) fill(cells().indexOf(cell), chars)
  })

  group.addEventListener("keydown", (event) => {
    const all = cells()
    const index = all.indexOf(event.target.closest(".newt-pin__cell"))
    if (index === -1) return
    const forward = getComputedStyle(group).direction === "rtl" ? -1 : 1
    const move = {
      ArrowLeft: index - forward,
      ArrowRight: index + forward,
      Home: 0,
      End: all.length - 1,
    }[event.key]
    if (move !== undefined) {
      event.preventDefault()
      all[Math.max(0, Math.min(all.length - 1, move))].focus()
      return
    }
    if (event.key === "Backspace" && all[index].value === "" && index > 0) {
      event.preventDefault()
      all[index - 1].value = ""
      all[index - 1].focus()
      announce()
    }
  })

  group.addEventListener("focusin", (event) => {
    event.target.closest(".newt-pin__cell")?.select()
  })
})
