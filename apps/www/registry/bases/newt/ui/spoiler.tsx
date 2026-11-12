"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface SpoilerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Controlled revealed state. */
  revealed?: boolean
  /** Initial revealed state when uncontrolled. */
  defaultRevealed?: boolean
  /** Called with the next revealed state when toggled. */
  onRevealedChange?: (revealed: boolean) => void
  /**
   * Accessible name while hidden, read in place of the content it hides.
   * Defaults to `"Spoiler, click to reveal"`; pass a translated string.
   */
  label?: string
}

const Spoiler = React.forwardRef<HTMLSpanElement, SpoilerProps>(
  (
    {
      className,
      revealed: revealedProp,
      defaultRevealed = false,
      onRevealedChange,
      label = "Spoiler, click to reveal",
      onClick,
      onKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultRevealed)
    const isControlled = revealedProp !== undefined
    const revealed = isControlled ? revealedProp : uncontrolled

    const toggle = () => {
      const next = !revealed
      if (!isControlled) setUncontrolled(next)
      onRevealedChange?.(next)
    }

    const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      toggle()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || revealed) return
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        toggle()
      }
    }

    return (
      <span
        ref={ref}
        role={revealed ? undefined : "button"}
        tabIndex={revealed ? undefined : 0}
        aria-label={revealed ? undefined : label}
        aria-expanded={revealed}
        data-state={revealed ? "revealed" : "hidden"}
        className={cn(
          "rounded-sm px-1 transition-[background-color] duration-fast ease-newt",
          revealed
            ? "cursor-text select-text bg-newt-bg-active text-newt-text-primary"
            : "cursor-pointer select-none bg-newt-spoiler hover:bg-newt-spoiler-hover",
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Hidden, the content is invisible and inert rather than painted in
         * the background colour: a link, an image or a child with its own
         * colour would otherwise show through, and a link could still be
         * clicked or tabbed to. Both keep its box, so the chip keeps the size
         * of what it hides. */}
        <span inert={!revealed} className={revealed ? undefined : "invisible"}>
          {children}
        </span>
      </span>
    )
  }
)
Spoiler.displayName = "Spoiler"

export { Spoiler }
