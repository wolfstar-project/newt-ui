export { default as Timestamp } from "./Timestamp.vue"

/*
 * The timestamp a message carries as `<t:1700000000:R>`: one instant, written
 * in the reader's own locale and time zone rather than the author's.
 *
 * The styles are the ones the raw syntax names, and they map onto
 * `Intl.DateTimeFormat` because that is the thing that already knows what a
 * date looks like in a hundred places. `relative` is the exception — it is
 * `Intl.RelativeTimeFormat`, and the only one that keeps changing after it is
 * rendered.
 */
export type TimestampStyle =
  | "shortTime"
  | "longTime"
  | "shortDate"
  | "longDate"
  | "shortDateTime"
  | "longDateTime"
  | "relative"

export const timestampFormats = {
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

/* Anything older than a year is counted in years, so this is where the ladder
 * stops and what it falls back to. */
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
export function relativeTime(
  date: Date,
  now: Date,
  locale: string | undefined
): string {
  const difference = date.getTime() - now.getTime()
  const seconds = Math.abs(difference) / 1000
  const scale: RelativeScale =
    SCALES.find((each) => seconds < each.limit) ?? YEARS
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  return formatter.format(Math.round(difference / scale.ms), scale.unit)
}
