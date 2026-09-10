import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Typeset is a wrapper and two class names — the rules live in the stylesheet
 * `add typeset` appended, keyed on `.typeset`. Nothing inside needs a class of
 * its own, which is the point: what goes in is whatever a markdown renderer
 * emitted, and it comes out with the library's rhythm.
 */
const typesetVariants = cva("typeset", {
  variants: {
    preset: {
      docs: "typeset-docs",
      chat: "typeset-chat",
      article: "typeset-article",
    },
    measure: {
      true: "typeset-measure",
      false: "",
    },
  },
  defaultVariants: {
    preset: "docs",
    measure: false,
  },
})

export interface TypesetProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typesetVariants> {
  /** Render as `<article>` or any other element that suits the content. */
  readonly as?: "div" | "article" | "section"
}

const Typeset = React.forwardRef<HTMLDivElement, TypesetProps>(
  ({ className, preset, measure, as: Component = "div", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(typesetVariants({ preset, measure }), className)}
      {...props}
    />
  )
)
Typeset.displayName = "Typeset"

export { Typeset, typesetVariants }
