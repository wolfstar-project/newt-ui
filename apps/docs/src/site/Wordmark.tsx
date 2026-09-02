import { cn } from "../lib/utils"

interface WordmarkProps {
  readonly className?: string
}

/*
 * Four strokes at four heights with one bar struck through them: a level meter
 * caught mid signal, which is what a chat client is. Drawn here rather than
 * fetched, so it inherits the text colour and needs no network.
 */
export function NewtMark({ className }: WordmarkProps) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <line x1="4" y1="7" x2="4" y2="20" />
        <line x1="9.3" y1="11" x2="9.3" y2="20" />
        <line x1="14.7" y1="4" x2="14.7" y2="20" />
        <line x1="20" y1="9" x2="20" y2="20" />
        <line x1="2.4" y1="15.4" x2="21.6" y2="15.4" />
      </g>
    </svg>
  )
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <NewtMark className="size-4.5 text-indigo" />
      <span className="font-ui text-[19px] leading-none font-bold tracking-[-0.045em] text-weft">
        newt/ui
      </span>
    </span>
  )
}
