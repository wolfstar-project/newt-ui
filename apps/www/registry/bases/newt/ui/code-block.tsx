import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

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

/** A run of text, coloured by `kind` when given, plain when not. */
export interface CodeTokenSpec {
  readonly text: string
  readonly kind?: VariantProps<typeof codeTokenVariants>["kind"]
}

export interface CodeBlockProps extends React.ComponentProps<"pre"> {
  /**
   * A flat list of runs, including the line breaks as `{ text: "\n" }`. This
   * is the syntax most callers want: a highlighter (or a hand-written token
   * list) produces one array, with no JSX whitespace to get exactly right —
   * `children` still renders as-is for anything composed by hand.
   */
  tokens?: readonly CodeTokenSpec[]
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ className, tokens, children, ...props }, ref) => (
    <pre
      ref={ref}
      className={cn(
        "overflow-x-auto rounded-md border border-newt-border bg-[#111214] p-4 font-mono text-[13px] leading-[1.6] text-newt-text-secondary",
        className
      )}
      {...props}
    >
      {tokens
        ? tokens.map((token, index) =>
            token.kind ? (
              <CodeToken key={index} kind={token.kind}>
                {token.text}
              </CodeToken>
            ) : (
              <React.Fragment key={index}>{token.text}</React.Fragment>
            )
          )
        : children}
    </pre>
  )
)
CodeBlock.displayName = "CodeBlock"

export { CodeBlock, CodeToken, codeTokenVariants }
