import { cn } from "../lib/utils"

interface MarkProps {
  readonly className?: string
}

/*
 * The two marks are the only colours on the site the palette does not own: a
 * framework is recognised by its own hue before it is read as a word. Drawn
 * here once, so the hero and the framework switch share the same paths.
 */
export function ReactMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5 text-[var(--brand-react)]", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="10.5" ry="4" />
        <ellipse
          cx="12"
          cy="12"
          rx="10.5"
          ry="4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10.5"
          ry="4"
          transform="rotate(120 12 12)"
        />
      </g>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  )
}

export function VueMark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5 text-[var(--brand-vue)]", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      >
        <path d="M1.5 4.5 12 21 22.5 4.5" />
        <path d="M8 4.5 12 10.5 16 4.5" />
      </g>
    </svg>
  )
}
