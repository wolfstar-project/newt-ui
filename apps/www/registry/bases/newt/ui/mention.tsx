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
  "inline-flex min-h-[22px] items-center gap-0.5 rounded-sm border-0 bg-[color-mix(in_srgb,var(--newt-mention-color)_15%,transparent)] px-1 align-middle font-sans text-[14px] font-medium leading-5 text-[var(--newt-mention-color)] no-underline transition-colors duration-fast ease-newt",
  {
    variants: {
      variant: {
        user: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
        channel:
          "[--newt-mention-color:var(--newt-text-link)] [--newt-mention-solid:var(--newt-brand)]",
        role: "[--newt-mention-color:var(--newt-mention-role)] [--newt-mention-solid:var(--newt-mention-color)]",
        app: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
      },
      /*
       * A mention that opens nothing (`as="span"`) keeps the tint but drops
       * the pointer, the hover fill and the focus ring: it is text, not a
       * control, and stays out of the tab order.
       */
      interactive: {
        true: "cursor-pointer hover:bg-[var(--newt-mention-solid)] hover:text-newt-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
        false: "",
      },
    },
    defaultVariants: {
      variant: "user",
      interactive: true,
    },
  }
)

/** The element a mention renders as. */
export type MentionElement = "button" | "a" | "span"

export interface MentionProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "color">,
    Omit<VariantProps<typeof mentionVariants>, "interactive"> {
  /**
   * `button` (the default) for a mention that opens something in place, `a`
   * for one that navigates (pass `href`), `span` for a read-only mention that
   * is neither focusable nor clickable.
   */
  as?: MentionElement
  /** Link target, for `as="a"`. Passing it without `as` renders a link. */
  href?: string
  /** Avatar URL. Rendered from 48rem up; below that the chip stays text-only. */
  avatar?: string
  /** Role colour, for `variant="role"`. Any CSS colour. */
  color?: string
}

/* Widens the tag so one ref type serves all three elements it can be. */
function asElementType(element: MentionElement): React.ElementType {
  return element
}

const Mention = React.forwardRef<HTMLElement, MentionProps>(
  (
    { as, href, className, variant, avatar, color, children, style, ...props },
    ref
  ) => {
    const element: MentionElement = as ?? (href === undefined ? "button" : "a")
    const Tag = asElementType(element)
    return (
      <Tag
        ref={ref}
        type={element === "button" ? "button" : undefined}
        href={element === "a" ? href : undefined}
        data-variant={variant ?? "user"}
        /*
         * SAFETY: `CSSProperties` has no index signature for custom properties,
         * but React forwards unknown `--*` keys to the style attribute
         * verbatim, so the extra key is written out exactly as spelled here.
         */
        style={
          color
            ? ({
                ...style,
                "--newt-mention-color": color,
              } as React.CSSProperties)
            : style
        }
        className={cn(
          mentionVariants({ variant, interactive: element !== "span" }),
          avatar && "ps-0.5",
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
      </Tag>
    )
  }
)
Mention.displayName = "Mention"

export { Mention, mentionVariants }
