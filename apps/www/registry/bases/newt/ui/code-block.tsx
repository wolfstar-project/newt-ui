import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const CodeBlock = React.forwardRef<HTMLPreElement, React.ComponentProps<"pre">>(
  ({ className, ...props }, ref) => (
    <pre
      ref={ref}
      className={cn(
        "overflow-x-auto rounded-md border border-newt-border bg-[#111214] p-4 font-mono text-[13px] leading-[1.6] text-newt-text-secondary",
        className
      )}
      {...props}
    />
  )
)
CodeBlock.displayName = "CodeBlock"

const codeTokenVariants = cva("", {
  variants: {
    kind: {
      keyword: "text-[#569cd6]",
      string: "text-[#ce9178]",
      comment: "text-[#6a9955]",
      function: "text-[#dcdcaa]",
    },
  },
})

export interface CodeTokenProps
  extends
    React.ComponentProps<"span">,
    VariantProps<typeof codeTokenVariants> {}

const CodeToken = React.forwardRef<HTMLSpanElement, CodeTokenProps>(
  ({ className, kind, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(codeTokenVariants({ kind }), className)}
      {...props}
    />
  )
)
CodeToken.displayName = "CodeToken"

export { CodeBlock, CodeToken, codeTokenVariants }
