import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The timestamp a message carries as `<t:1700000000:R>`: one instant, written
 * in the reader's own locale and time zone rather than the author's.
 *
 * The styles are the ones the raw syntax names, and they map onto
 * `Intl.DateTimeFormat` because that is the thing that already knows what a
 * date looks like in a hundred places. `relative` is the exception — it is
 * `Intl.RelativeTimeFormat`, and it is the only one that keeps changing after
 * it is rendered.
 */
export type TimestampStyle =
  | "shortTime"
  | "longTime"
  | "shortDate"
  | "longDate"
  | "shortDateTime"
  | "longDateTime"
  | "relative"

const FORMATS = {
  shortTime: { hour: "numeric", minute: "2-digit" },
  longTime: { hour: "numeric", minute: "2-digit", second: "2-digit" },
  shortDate: { day: "2-digit", month: "2-digit", year: "numeric" },
  longDate: { day: "numeric", month: "long", year: "numeric" },
  shortDateTime: {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
  longDateTime: {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  },
} as const satisfies Record<
  Exclude<TimestampStyle, "relative">,
  Intl.DateTimeFormatOptions
>

interface RelativeScale {
  readonly limit: number
  readonly unit: Intl.RelativeTimeFormatUnit
  readonly ms: number
}

/* Anything older than a year is counted in years, so this is where the
 * ladder stops and what it falls back to. */
const YEARS = {
  limit: Infinity,
  unit: "year",
  ms: 31_536_000_000,
} as const satisfies RelativeScale

const SCALES = [
  { limit: 60, unit: "second", ms: 1000 },
  { limit: 3600, unit: "minute", ms: 60_000 },
  { limit: 86_400, unit: "hour", ms: 3_600_000 },
  { limit: 2_592_000, unit: "day", ms: 86_400_000 },
  { limit: 31_536_000, unit: "month", ms: 2_592_000_000 },
  YEARS,
] as const satisfies readonly RelativeScale[]

/** `in 3 hours`, `2 days ago` — the largest unit that still says something. */
function relative(date: Date, now: Date, locale: string | undefined): string {
  const difference = date.getTime() - now.getTime()
  const seconds = Math.abs(difference) / 1000
  const scale: RelativeScale =
    SCALES.find((each) => seconds < each.limit) ?? YEARS
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  return formatter.format(Math.round(difference / scale.ms), scale.unit)
}

export interface TimestampProps extends Omit<
  React.TimeHTMLAttributes<HTMLTimeElement>,
  "dateTime"
> {
  /** The instant. A number is read as seconds, the way the raw syntax writes it. */
  value: Date | number
  /** Which of the styles to render. Defaults to the one the syntax defaults to. */
  format?: TimestampStyle
  /** Overrides the reader's locale, which is otherwise the browser's. */
  locale?: string
  /**
   * How often a relative timestamp redraws, in milliseconds. Zero freezes it,
   * which is what a server render wants.
   */
  tick?: number
}

const Timestamp = React.forwardRef<HTMLTimeElement, TimestampProps>(
  (
    {
      className,
      value,
      format = "shortDateTime",
      locale,
      tick = 60_000,
      ...props
    },
    ref
  ) => {
    /*
     * A bare number is seconds, not milliseconds: that is what the message
     * syntax carries, and converting here means callers never have to
     * remember which one this component wanted.
     */
    const date = React.useMemo(
      () => (value instanceof Date ? value : new Date(value * 1000)),
      [value]
    )

    const [now, setNow] = React.useState(() => new Date())

    React.useEffect(() => {
      if (format !== "relative" || tick <= 0) return
      const timer = setInterval(() => setNow(new Date()), tick)
      return () => clearInterval(timer)
    }, [format, tick])

    const text =
      format === "relative"
        ? relative(date, now, locale)
        : new Intl.DateTimeFormat(locale, FORMATS[format]).format(date)

    /*
     * The full instant lives in the tooltip and in `dateTime`, so a relative
     * label never hides the thing it is a label for.
     */
    const exact = new Intl.DateTimeFormat(locale, FORMATS.longDateTime).format(
      date
    )

    return (
      <time
        ref={ref}
        dateTime={date.toISOString()}
        title={exact}
        className={cn(
          "rounded-sm bg-newt-bg-elevated px-1 text-newt-text-primary",
          className
        )}
        {...props}
      >
        {text}
      </time>
    )
  }
)
Timestamp.displayName = "Timestamp"

export { Timestamp }
