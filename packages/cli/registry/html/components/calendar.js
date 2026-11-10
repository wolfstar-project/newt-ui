/*
 * Draws the month and moves through it. Dates are `YYYY-MM-DD` strings and
 * all arithmetic is in UTC, so a day never shifts with the reader's time
 * zone. The container reads `data-value` (the chosen day), and optionally
 * `data-min`, `data-max`, `data-locale` and `data-week-start` (0 is Sunday).
 * Choosing a day dispatches `newt:change` with the date string.
 *
 * Arrow keys move by a day or a week, Home and End go to the ends of the
 * week, Page Up and Page Down change month, and moving off the edge of the
 * month turns the page.
 */
const DAY = 86_400_000
const pad = (number) => String(number).padStart(2, "0")
const toIso = (date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
const fromIso = (iso) => new Date(`${iso}T00:00:00Z`)

document.querySelectorAll("[data-newt-calendar]").forEach((calendar) => {
  const title = calendar.querySelector(".newt-calendar__title")
  const grid = calendar.querySelector(".newt-calendar__grid")
  const body = grid?.querySelector("tbody")
  if (!title || !grid || !body) return

  const locale = calendar.dataset.locale || "en-US"
  const weekStart = Number(calendar.dataset.weekStart || 0)
  const now = new Date()
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  let selected = calendar.dataset.value || ""
  let focused = selected || today

  /* The nearest day that can be chosen; a month jump lands on it too. */
  const clamp = (iso) =>
    calendar.dataset.min && iso < calendar.dataset.min
      ? calendar.dataset.min
      : calendar.dataset.max && iso > calendar.dataset.max
        ? calendar.dataset.max
        : iso

  /*
   * The one tab stop is clamped: a disabled day cannot take focus, so with
   * today or the value outside the range the grid would have no way in.
   */
  focused = clamp(focused)

  const allowed = (iso) =>
    (!calendar.dataset.min || iso >= calendar.dataset.min) &&
    (!calendar.dataset.max || iso <= calendar.dataset.max)

  function render(moveFocus) {
    const anchor = fromIso(focused)
    const year = anchor.getUTCFullYear()
    const month = anchor.getUTCMonth()
    const label = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(anchor)
    title.textContent = label
    grid.setAttribute("aria-label", label)

    const first = new Date(Date.UTC(year, month, 1))
    const lead = (first.getUTCDay() - weekStart + 7) % 7
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    body.replaceChildren()
    let row
    for (let slot = 0; slot < lead + days; slot += 1) {
      if (slot % 7 === 0) row = body.insertRow()
      const cell = row.insertCell()
      cell.className = "newt-calendar__cell"
      if (slot < lead) continue
      const iso = toIso(new Date(Date.UTC(year, month, slot - lead + 1)))
      cell.setAttribute("role", "gridcell")
      cell.setAttribute("aria-selected", String(iso === selected))
      const day = document.createElement("button")
      day.type = "button"
      day.className = "newt-calendar__day"
      day.dataset.date = iso
      day.tabIndex = iso === focused ? 0 : -1
      day.disabled = !allowed(iso)
      day.textContent = String(slot - lead + 1)
      if (iso === today) day.setAttribute("aria-current", "date")
      cell.append(day)
    }
    if (moveFocus) body.querySelector(`[data-date="${focused}"]`)?.focus()
  }

  function shiftMonth(amount) {
    const from = fromIso(focused)
    const target = new Date(
      Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + amount, 1)
    )
    const last = new Date(
      Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
    ).getUTCDate()
    target.setUTCDate(Math.min(from.getUTCDate(), last))
    return toIso(target)
  }

  calendar.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-newt-calendar-nav]")
    if (nav) {
      focused = shiftMonth(Number(nav.dataset.newtCalendarNav))
      render(false)
      return
    }
    const day = event.target.closest(".newt-calendar__day")
    if (!day || day.disabled) return
    selected = day.dataset.date
    focused = selected
    calendar.dataset.value = selected
    render(true)
    calendar.dispatchEvent(
      new CustomEvent("newt:change", {
        detail: { value: selected },
        bubbles: true,
      })
    )
  })

  grid.addEventListener("keydown", (event) => {
    const day = event.target.closest(".newt-calendar__day")
    if (!day) return
    const forward = getComputedStyle(calendar).direction === "rtl" ? -1 : 1
    const at = fromIso(day.dataset.date)
    const column = (at.getUTCDay() - weekStart + 7) % 7
    const byDays = {
      ArrowLeft: -forward,
      ArrowRight: forward,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -column,
      End: 6 - column,
    }[event.key]
    let next
    if (byDays !== undefined)
      next = toIso(new Date(at.getTime() + byDays * DAY))
    else if (event.key === "PageUp") next = clamp(shiftMonth(-1))
    else if (event.key === "PageDown") next = clamp(shiftMonth(1))
    else return
    event.preventDefault()
    if (!allowed(next)) return
    focused = next
    render(true)
  })

  render(false)
})
