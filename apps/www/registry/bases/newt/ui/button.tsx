import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap border-0 font-sans font-medium leading-4 transition-[background-color,color,box-shadow] duration-fast ease-newt active:translate-y-[0.5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 no-underline",
  {
    variants: {
      variant: {
        primary:
          "bg-newt-brand text-newt-on-accent hover:bg-newt-brand-hover active:bg-newt-brand-active",
        secondary:
          "bg-newt-bg-elevated text-newt-text-primary hover:bg-newt-bg-hover",
        danger: "bg-newt-danger text-newt-on-accent hover:bg-newt-danger-hover",
        success: "bg-newt-online text-newt-on-accent hover:brightness-90",
        link: "bg-transparent text-newt-text-link hover:underline",
      },
      size: {
        default: "rounded-sm px-4 py-2.5 text-sm",
        sm: "rounded-sm px-3 py-1.5 text-[13px]",
        lg: "rounded-sm px-6 py-3 text-base",
        icon: "rounded-full p-2 text-sm",
      },
    },
    compoundVariants: [
      { variant: "link", size: "default", class: "px-0 py-1" },
      { variant: "link", size: "sm", class: "px-0 py-1" },
      { variant: "link", size: "lg", class: "px-0 py-1" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

/* The "opens elsewhere" glyph Discord puts on link buttons. */
const LaunchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className="h-4 w-4 shrink-0"
  >
    <path
      fill="currentColor"
      d="M10 5a1 1 0 0 0 0 2h6.59L4.3 19.3a1 1 0 1 0 1.4 1.4L18 8.42V15a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1h-9Z"
    />
  </svg>
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * The element or component to render. Defaults to `button`, or to `a` when
   * `href` is set; pass a router link component to keep client navigation.
   */
  as?: React.ElementType
  /** Render a link to this URL. */
  href?: string
  /** Link target, with `href`. */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"]
  /** Link relationship, with `href`. */
  rel?: string
  /** Emoji image URL, rendered before the label. */
  emoji?: string
  /** Accessible name for `emoji`; empty (the default) hides it from readers. */
  emojiAlt?: string
  /** Link-out glyph after the label. Defaults on for `variant="link"`. */
  launchIcon?: boolean
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      as,
      className,
      variant,
      size,
      type = "button",
      href,
      disabled,
      emoji,
      emojiAlt = "",
      launchIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Tag: React.ElementType = as ?? (href === undefined ? "button" : "a")
    const isButton = Tag === "button"
    const showLaunch = launchIcon ?? variant === "link"
    return (
      <Tag
        ref={ref}
        type={isButton ? type : undefined}
        /*
         * A link has no `disabled`: it loses its `href` instead, which takes
         * it out of the tab order, and says so with `aria-disabled`.
         */
        href={disabled ? undefined : href}
        disabled={isButton ? disabled : undefined}
        aria-disabled={!isButton && disabled ? true : undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {emoji ? (
          <img
            src={emoji}
            alt={emojiAlt}
            aria-hidden={emojiAlt === "" ? true : undefined}
            draggable={false}
            className="h-[1.375em] w-[1.375em] shrink-0 object-contain align-bottom"
          />
        ) : null}
        <span className="truncate">{children}</span>
        {showLaunch ? <LaunchIcon /> : null}
      </Tag>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
