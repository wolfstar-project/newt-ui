import * as React from "react"

import { cn } from "@/lib/utils"

const typingKeyframes = `
@keyframes newt-typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-3px); opacity: 1; }
}`

export interface TypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible label announced to screen readers. */
  label?: string
}

const TypingIndicator = React.forwardRef<HTMLDivElement, TypingIndicatorProps>(
  ({ className, label = "Someone is typing", children, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-2 text-[13px] text-newt-text-muted",
        className
      )}
      {...props}
    >
      <style>{typingKeyframes}</style>
      <TypingIndicatorDots />
      {children}
    </div>
  )
)
TypingIndicator.displayName = "TypingIndicator"

const TypingIndicatorDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex gap-[3px]", className)}
    aria-hidden="true"
    {...props}
  >
    {[0, 0.15, 0.3].map((delay) => (
      <span
        key={delay}
        className="h-[6px] w-[6px] rounded-full bg-newt-text-muted animate-[newt-typing-bounce_1.2s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-80"
        style={{ animationDelay: `${delay}s` }}
      />
    ))}
  </div>
))
TypingIndicatorDots.displayName = "TypingIndicatorDots"

export { TypingIndicator, TypingIndicatorDots }
