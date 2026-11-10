/*
 * Enter or a comma turns the text into a chip; Backspace in an empty field
 * takes the last chip back; a chip's button removes it. A duplicate is
 * dropped rather than added twice. Every change dispatches `newt:change`
 * with the full list.
 */
const REMOVE_ICON =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4.3 4.3a1 1 0 0 1 1.4 0L8 6.6l2.3-2.3a1 1 0 1 1 1.4 1.4L9.4 8l2.3 2.3a1 1 0 0 1-1.4 1.4L8 9.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L6.6 8 4.3 5.7a1 1 0 0 1 0-1.4Z"/></svg>'

document.querySelectorAll("[data-newt-tag-input]").forEach((field) => {
  const input = field.querySelector(".newt-tag-input__input")
  if (!input) return

  const tags = () => [...field.querySelectorAll(".newt-tag-input__tag")]
  const values = () => tags().map((tag) => tag.dataset.value ?? label(tag))
  const label = (tag) => tag.firstChild?.textContent?.trim() ?? ""

  function announce() {
    field.dispatchEvent(
      new CustomEvent("newt:change", {
        detail: { value: values() },
        bubbles: true,
      })
    )
  }

  function add(text) {
    const value = text.trim()
    if (value === "" || values().includes(value)) return
    const tag = document.createElement("span")
    tag.className = "newt-tag-input__tag"
    tag.dataset.value = value
    tag.append(document.createTextNode(value))
    const remove = document.createElement("button")
    remove.type = "button"
    remove.className = "newt-tag-input__remove"
    remove.setAttribute("aria-label", `Remove ${value}`)
    remove.innerHTML = REMOVE_ICON
    tag.append(remove)
    input.before(tag)
    announce()
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      add(input.value)
      input.value = ""
    } else if (event.key === "Backspace" && input.value === "") {
      const last = tags().at(-1)
      if (!last) return
      last.remove()
      announce()
    }
  })

  /* A pasted list is split on commas and new lines. */
  input.addEventListener("paste", (event) => {
    const text = event.clipboardData?.getData("text") ?? ""
    if (!/[,\n]/.test(text)) return
    event.preventDefault()
    text.split(/[,\n]/).forEach(add)
  })

  field.addEventListener("click", (event) => {
    const remove = event.target.closest(".newt-tag-input__remove")
    if (remove) {
      remove.closest(".newt-tag-input__tag")?.remove()
      announce()
    }
    input.focus()
  })
})
