"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const reactionVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[13px] transition-[background-color,border-color] duration-fast ease-newt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
  {
    variants: {
      active: {
        false: "border-newt-border bg-newt-bg-surface text-newt-text-secondary",
        true: "border-newt-brand bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] text-newt-mention-text",
      },
      /* `false` for a read-only reaction: no pointer, no hover. */
      interactive: {
        true: "cursor-pointer",
        false: "cursor-[inherit]",
      },
    },
    compoundVariants: [
      { active: false, interactive: true, class: "hover:bg-newt-bg-hover" },
    ],
    defaultVariants: {
      active: false,
      interactive: true,
    },
  }
)

function isStringNode(value: React.ReactNode): value is string {
  return Object.prototype.toString.call(value) === "[object String]"
}

/** What the accessible name of a reaction is built from. */
export interface ReactionLabelState {
  /** The emoji's text, or `emojiAlt` for an image emoji, or `"Emoji"`. */
  emoji: string
  count: number
  active: boolean
}

/** The English default. Pass `formatLabel` to translate it. */
export function defaultReactionLabel({
  emoji,
  count,
  active,
}: ReactionLabelState): string {
  return `${emoji} reaction, ${count} ${count === 1 ? "person" : "people"}${
    active ? ", you reacted" : ""
  }`
}

export interface ReactionProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    Omit<VariantProps<typeof reactionVariants>, "interactive"> {
  /** Emoji or icon rendered on the left. Optional when `emojiSrc` is set. */
  emoji?: React.ReactNode
  /** Image URL of a server (custom) emoji, rendered instead of `emoji`. */
  emojiSrc?: string
  /** Name of the emoji, for the accessible name: `:wolf:` or `wolf`. */
  emojiAlt?: string
  /** Number of users who reacted. */
  count: number
  /** Controlled active state. */
  active?: boolean
  /** Initial active state when uncontrolled. */
  defaultActive?: boolean
  /** Called with the next active state when toggled. */
  onActiveChange?: (active: boolean) => void
  /**
   * Show the count without a toggle: renders a `<span>` that is not focusable
   * and ignores clicks, for feeds that only display reactions.
   */
  readonly?: boolean
  /** Builds the accessible name; `aria-label` still wins when both are set. */
  formatLabel?: (state: ReactionLabelState) => string
}

/* Widens the tag so one ref type serves both elements it can be. */
function asElementType(element: "span" | "button"): React.ElementType {
  return element
}

const Reaction = React.forwardRef<HTMLElement, ReactionProps>(
  (
    {
      className,
      emoji,
      emojiSrc,
      emojiAlt,
      count,
      active: activeProp,
      defaultActive = false,
      onActiveChange,
      onClick,
      readonly = false,
      formatLabel = defaultReactionLabel,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultActive)
    const isControlled = activeProp !== undefined
    const active = isControlled ? activeProp : uncontrolled

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      const next = !active
      if (!isControlled) setUncontrolled(next)
      onActiveChange?.(next)
    }

    const label =
      ariaLabel ??
      formatLabel({
        emoji: emojiAlt ?? (isStringNode(emoji) ? emoji : "Emoji"),
        count,
        active,
      })

    const content = (
      <>
        {emojiSrc ? (
          <img
            src={emojiSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="h-4 w-4 object-contain"
          />
        ) : (
          <span aria-hidden="true">{emoji}</span>
        )}
        <span aria-hidden="true" className="text-xs font-semibold">
          {count}
        </span>
      </>
    )

    /*
     * Read-only renders a `<span>`: it keeps every attribute a caller passes
     * (`style`, `data-*`, `aria-describedby`, handlers other than `onClick`)
     * but drops the ones only a button understands, and never toggles.
     */
    const Tag = asElementType(readonly ? "span" : "button")
    const {
      type: _type,
      disabled: _disabled,
      form: _form,
      formAction: _formAction,
      formEncType: _formEncType,
      formMethod: _formMethod,
      formNoValidate: _formNoValidate,
      formTarget: _formTarget,
      name: _name,
      value: _value,
      ...shared
    } = props
    const elementProps = readonly
      ? { role: "img", ...shared }
      : {
          type: "button",
          "aria-pressed": active,
          onClick: handleClick,
          ...props,
        }

    return (
      <Tag
        ref={ref}
        aria-label={label}
        data-state={active ? "active" : "inactive"}
        className={cn(
          reactionVariants({ active, interactive: !readonly }),
          className
        )}
        {...elementProps}
      >
        {content}
      </Tag>
    )
  }
)
Reaction.displayName = "Reaction"

/* The row of reactions under a message. */
const ReactionGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-1 flex flex-wrap items-center gap-1", className)}
    {...props}
  />
))
ReactionGroup.displayName = "ReactionGroup"

export { Reaction, ReactionGroup, reactionVariants }
