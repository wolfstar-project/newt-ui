import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The sizes are the chat markdown ones, so a text display and a `Markdown`
 * message agree: `#` is 24px, `##` is 20px, `###` is 16px and `-#` subtext
 * is 13px in the muted colour. `default` keeps the size and colour of the
 * container around it.
 */
const textDisplayVariants = cva(
  "m-0 min-w-0 whitespace-pre-line break-words [overflow-wrap:anywhere]",
  {
    variants: {
      size: {
        default: "",
        "heading-1":
          "text-2xl font-bold leading-[1.375] text-newt-text-primary",
        "heading-2": "text-xl font-bold leading-[1.375] text-newt-text-primary",
        "heading-3":
          "text-base font-bold leading-[1.375] text-newt-text-primary",
        subtext: "text-[13px] leading-[1.3] text-newt-text-muted",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface TextDisplayProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textDisplayVariants> {
  /**
   * The element or component to render. Defaults to `div`; pass `h2` or
   * `h3` when a heading size is also a heading of the page.
   */
  as?: React.ElementType
}

/*
 * A block of message text, the most common Components V2 part. Line breaks
 * in the text are kept (`white-space: pre-line`), so a string with `\n`
 * renders the way the message was written.
 */
const TextDisplay = React.forwardRef<HTMLElement, TextDisplayProps>(
  ({ as: Tag = "div", className, size, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(textDisplayVariants({ size }), className)}
      {...props}
    />
  )
)
TextDisplay.displayName = "TextDisplay"

export { TextDisplay, textDisplayVariants }
