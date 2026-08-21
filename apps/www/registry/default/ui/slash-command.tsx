import * as React from "react"

import { cn } from "@/lib/utils"

export interface SlashCommandProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Command name rendered after the leading slash. */
  command?: string
}

const SlashCommand = React.forwardRef<HTMLSpanElement, SlashCommandProps>(
  ({ className, command, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-[6px] rounded-sm bg-[rgba(88,101,242,0.15)] py-[2px] pl-[6px] pr-2 font-mono text-[13px] text-[#b3baff]",
        className
      )}
      {...props}
    >
      <span className="opacity-80" aria-hidden="true">
        /
      </span>
      {command ?? children}
    </span>
  )
)
SlashCommand.displayName = "SlashCommand"

export { SlashCommand }
