import { FRAMEWORK_MARKS, markTint, type MarkPath } from "@/lib/framework-marks"
import type { FrameworkId } from "@/lib/install-targets"

/** The React half of the marks; the paths live in `lib/framework-marks.ts`. */
export default function FrameworkGlyph({
  id,
  className,
}: {
  readonly id: FrameworkId
  readonly className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={["framework-glyph", className].filter(Boolean).join(" ")}
      data-tint={markTint(id)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {FRAMEWORK_MARKS[id].map((path: MarkPath) => (
        <path
          key={path.d}
          d={path.d}
          fill={path.filled ? "currentColor" : undefined}
          stroke={path.filled ? "none" : undefined}
        />
      ))}
    </svg>
  )
}
