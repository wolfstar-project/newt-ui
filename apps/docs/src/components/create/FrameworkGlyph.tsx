import {
  FRAMEWORK_MARKS,
  markTint,
  type GlyphPart,
} from "@/lib/framework-marks"
import type { FrameworkId } from "@/lib/install-targets"

/** The React half of the glyphs; the shapes live in `lib/framework-marks.ts`. */
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
      {FRAMEWORK_MARKS[id].map((part: GlyphPart, index) =>
        part.kind === "path" ? (
          <path
            key={index}
            d={part.d}
            fill={part.filled ? "currentColor" : undefined}
            stroke={part.filled ? "none" : undefined}
          />
        ) : (
          <circle
            key={index}
            cx={part.cx}
            cy={part.cy}
            r={part.r}
            fill={part.filled ? "currentColor" : undefined}
            stroke={part.filled ? "none" : undefined}
          />
        )
      )}
    </svg>
  )
}
