import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Every variant only sets two custom properties: the tint the chip renders at
 * rest and the solid colour it fills with on hover. A role mention overrides
 * `--newt-mention-color` inline with the role's own hue, and its hover fill
 * follows automatically.
 */
const mentionVariants = cva(
  "inline-flex min-h-[22px] cursor-pointer items-center gap-0.5 rounded-sm border-0 bg-[color-mix(in_srgb,var(--newt-mention-color)_15%,transparent)] px-1 align-middle font-sans text-[14px] font-medium leading-5 text-[var(--newt-mention-color)] transition-colors duration-fast ease-newt hover:bg-[var(--newt-mention-solid)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
  {
    variants: {
      variant: {
        user: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
        channel:
          "[--newt-mention-color:var(--newt-text-link)] [--newt-mention-solid:var(--newt-brand)]",
        role: "[--newt-mention-color:var(--newt-mention-role)] [--newt-mention-solid:var(--newt-mention-color)]",
        app: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
      },
    },
    defaultVariants: {
      variant: "user",
    },
  }
)

export interface MentionProps
  extends
    Omit<React.ComponentProps<"button">, "color">,
    VariantProps<typeof mentionVariants> {
  /** Avatar URL. Rendered from 48rem up; below that the chip stays text-only. */
  avatar?: string
  /** Role colour, for `variant="role"`. Any CSS colour. */
  color?: string
}

const Mention = React.forwardRef<HTMLButtonElement, MentionProps>(
  ({ className, variant, avatar, color, children, style, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-variant={variant ?? "user"}
      /*
       * SAFETY: `CSSProperties` has no index signature for custom properties,
       * but React forwards unknown `--*` keys to the style attribute verbatim,
       * so the extra key is written out exactly as spelled here.
       */
      style={
        color
          ? ({ ...style, "--newt-mention-color": color } as React.CSSProperties)
          : style
      }
      className={cn(
        mentionVariants({ variant }),
        avatar && "pl-0.5",
        className
      )}
      {...props}
    >
      {avatar ? (
        <img
          src={avatar}
          alt=""
          aria-hidden="true"
          className="hidden h-5 w-5 shrink-0 rounded-full object-cover md:block"
        />
      ) : null}
      {children}
    </button>
  )
)
Mention.displayName = "Mention"

export { Mention, mentionVariants }
