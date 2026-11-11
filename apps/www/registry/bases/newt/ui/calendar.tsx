"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface CalendarProps extends Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> {
  /** The chosen day as `YYYY-MM-DD`. Leave undefined to let the calendar own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** The first and last day that can be chosen, as `YYYY-MM-DD`. */
  min?: string
  max?: string
  /** A BCP 47 tag for the month and weekday names. */
  locale?: string
  /** `0` starts the week on Sunday, `1` on Monday. */
  weekStartsOn?: 0 | 1
  /** Accessible names of the two month buttons. */
  previousLabel?: string
  nextLabel?: string
}

/*
 * Dates are `YYYY-MM-DD` strings and all arithmetic is in UTC, so a day never
 * shifts with the reader's time zone and two dates compare as text.
 */
const DAY = 86_400_000
const pad = (value: number) => String(value).padStart(2, "0")
const toIso = (date: Date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
const fromIso = (iso: string) => new Date(`${iso}T00:00:00Z`)

/** The same day of the month `amount` months away, or that month's last day. */
function shiftMonth(iso: string, amount: number): string {
  const from = fromIso(iso)
  const target = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + amount, 1)
  )
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate()
  target.setUTCDate(Math.min(from.getUTCDate(), last))
  return toIso(target)
}

function localToday(): string {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/* 4 January 1970 was a Sunday, which makes it day zero of a week of names. */
const SUNDAY = Date.UTC(1970, 0, 4)

const navClassName =
  "inline-flex h-7 w-7 items-center justify-center rounded-sm text-newt-text-muted hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link"

/*
 * One month as a grid of days. The days are real buttons inside a table with
 * `role="grid"`, so a screen reader announces the weekday column as it moves,
 * and only one day at a time is a tab stop: the arrow keys do the rest, and
 * moving off the edge of the month turns the page. Today is marked by an
 * outline and the chosen day by a fill.
 */
const Calendar = React.forwardRef<HTMLDivElement | null, CalendarProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      locale = "en-US",
      weekStartsOn = 0,
      previousLabel = "Previous month",
      nextLabel = "Next month",
      ...props
    },
    ref
  ) => {
    const root = React.useRef<HTMLDivElement | null>(null)
    React.useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => root.current
    )
    const [internal, setInternal] = React.useState(defaultValue)
    const selected = value ?? internal
    /*
     * "Today" is the reader's, so it is only known in the browser. Until
     * then a calendar with no value has no month to show and draws none.
     */
    const [today, setToday] = React.useState<string | undefined>(undefined)
    const [cursor, setCursor] = React.useState(selected)
    const moveFocus = React.useRef(false)

    /* A controlled value changed from outside turns the page to it. */
    const [seenValue, setSeenValue] = React.useState(value)
    if (value !== seenValue) {
      setSeenValue(value)
      if (value !== undefined) setCursor(value)
    }

    /* The nearest day that can be chosen; a month jump lands on it too. */
    const clamp = (iso: string) =>
      min !== undefined && iso < min
        ? min
        : max !== undefined && iso > max
          ? max
          : iso

    /*
     * The one tab stop. It is clamped because a disabled day cannot take
     * focus: with today or the value outside the range, the grid would
     * otherwise have no way in from the keyboard.
     */
    /* An empty string is how a form says "no date yet"; it is not a day. */
    const anchorDay = cursor === "" ? today : (cursor ?? today)
    const focused = anchorDay === undefined ? undefined : clamp(anchorDay)

    React.useEffect(() => setToday(localToday()), [])

    React.useEffect(() => {
      if (!moveFocus.current || focused === undefined) return
      moveFocus.current = false
      root.current
        ?.querySelector<HTMLElement>(`[data-date="${focused}"]`)
        ?.focus()
    }, [focused])

    const allowed = (iso: string) =>
      (min === undefined || iso >= min) && (max === undefined || iso <= max)

    const goTo = (iso: string, withFocus: boolean) => {
      moveFocus.current = withFocus
      setCursor(iso)
    }

    const weekdays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(SUNDAY + (index + weekStartsOn) * DAY)
      const name = (weekday: "long" | "short") =>
        new Intl.DateTimeFormat(locale, { weekday, timeZone: "UTC" }).format(
          date
        )
      return { long: name("long"), short: name("short").slice(0, 2) }
    })

    const anchor = focused === undefined ? undefined : fromIso(focused)
    const title =
      anchor === undefined
        ? ""
        : new Intl.DateTimeFormat(locale, {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(anchor)

    const weeks: (string | undefined)[][] = []
    if (anchor !== undefined) {
      const year = anchor.getUTCFullYear()
      const month = anchor.getUTCMonth()
      const lead =
        (new Date(Date.UTC(year, month, 1)).getUTCDay() - weekStartsOn + 7) % 7
      const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
      for (let slot = 0; slot < lead + days; slot += 1) {
        if (slot % 7 === 0) weeks.push([])
        weeks
          .at(-1)
          ?.push(
            slot < lead
              ? undefined
              : toIso(new Date(Date.UTC(year, month, slot - lead + 1)))
          )
      }
    }

    const onKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      iso: string
    ) => {
      const forward =
        getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1
      const at = fromIso(iso)
      const column = (at.getUTCDay() - weekStartsOn + 7) % 7
      let next: string
      switch (event.key) {
        case "ArrowLeft":
          next = toIso(new Date(at.getTime() - forward * DAY))
          break
        case "ArrowRight":
          next = toIso(new Date(at.getTime() + forward * DAY))
          break
        case "ArrowUp":
          next = toIso(new Date(at.getTime() - 7 * DAY))
          break
        case "ArrowDown":
          next = toIso(new Date(at.getTime() + 7 * DAY))
          break
        case "Home":
          next = toIso(new Date(at.getTime() - column * DAY))
          break
        case "End":
          next = toIso(new Date(at.getTime() + (6 - column) * DAY))
          break
        case "PageUp":
          next = clamp(shiftMonth(iso, -1))
          break
        case "PageDown":
          next = clamp(shiftMonth(iso, 1))
          break
        default:
          return
      }
      event.preventDefault()
      if (allowed(next)) goTo(next, true)
    }

    return (
      <div
        ref={root}
        className={cn(
          "inline-flex flex-col gap-2 rounded-md border border-newt-border bg-newt-bg-surface p-3 text-newt-text-primary",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label={previousLabel}
            disabled={focused === undefined}
            onClick={() => {
              if (focused !== undefined) goTo(shiftMonth(focused, -1), false)
            }}
            className={navClassName}
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-3.5 w-3.5 -scale-x-100 rtl:scale-x-100"
            >
              <path
                fill="currentColor"
                d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
              />
            </svg>
          </button>
          <div aria-live="polite" className="text-sm font-semibold leading-5">
            {title}
          </div>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={focused === undefined}
            onClick={() => {
              if (focused !== undefined) goTo(shiftMonth(focused, 1), false)
            }}
            className={navClassName}
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-3.5 w-3.5 rtl:-scale-x-100"
            >
              <path
                fill="currentColor"
                d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
              />
            </svg>
          </button>
        </div>
        <table role="grid" aria-label={title} className="border-collapse">
          <thead>
            <tr>
              {weekdays.map((weekday) => (
                <th
                  key={weekday.long}
                  scope="col"
                  abbr={weekday.long}
                  className="h-7 w-9 p-0 text-center text-[11px] font-bold uppercase text-newt-text-muted"
                >
                  {weekday.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.find((iso) => iso !== undefined)}>
                {week.map((iso, column) =>
                  iso === undefined ? (
                    <td key={`blank-${column}`} className="p-px" />
                  ) : (
                    <td
                      key={iso}
                      role="gridcell"
                      aria-selected={iso === selected}
                      className="p-px"
                    >
                      <button
                        type="button"
                        data-date={iso}
                        tabIndex={iso === focused ? 0 : -1}
                        disabled={!allowed(iso)}
                        aria-current={iso === today ? "date" : undefined}
                        onClick={() => {
                          if (value === undefined) setInternal(iso)
                          onValueChange?.(iso)
                          goTo(iso, true)
                        }}
                        onKeyDown={(event) => onKeyDown(event, iso)}
                        className={cn(
                          "flex h-[34px] w-[34px] items-center justify-center rounded-sm p-0 font-sans text-[13px] tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-35",
                          iso === selected
                            ? "bg-newt-brand font-bold text-newt-on-accent"
                            : "text-newt-text-secondary enabled:hover:bg-newt-bg-hover enabled:hover:text-newt-text-primary",
                          iso === today &&
                            iso !== selected &&
                            "text-newt-text-primary shadow-[inset_0_0_0_1px_var(--newt-text-muted)]"
                        )}
                      >
                        {Number(iso.slice(8))}
                      </button>
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)
Calendar.displayName = "Calendar"

export { Calendar }
