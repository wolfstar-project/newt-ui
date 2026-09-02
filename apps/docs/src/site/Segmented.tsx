import { cn } from "../lib/utils"

interface SegmentedProps<T extends string> {
  readonly legend: string
  readonly options: readonly T[]
  readonly value: T
  readonly onSelect: (next: T) => void
  readonly className?: string
}

/*
 * The one multiple choice control on the site. It is a fieldset because the
 * options are one question, and the question is the legend a screen reader
 * hears; sighted readers get it from where the control sits.
 */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onSelect,
  className,
}: SegmentedProps<T>) {
  return (
    <fieldset
      className={cn(
        "inline-flex items-center border border-reed bg-ground",
        className
      )}
    >
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onSelect(option)}
          className="flex h-7 cursor-pointer items-center px-3 font-data text-[11px] tracking-[0.04em] text-weft-dim uppercase transition-colors duration-(--dur-instant) ease-(--ease-beat) hover:text-weft aria-pressed:bg-indigo aria-pressed:text-white"
        >
          {option}
        </button>
      ))}
    </fieldset>
  )
}
