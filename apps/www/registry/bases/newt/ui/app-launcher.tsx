"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Dialog as DialogPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"
import { scrollbarClassName } from "@/registry/bases/newt/ui/scrollbar"

const appLauncherVariants = cva(
  "flex w-full flex-col overflow-hidden border border-newt-border bg-newt-bg-surface text-newt-text-primary shadow-elevation-high",
  {
    variants: {
      variant: {
        /* The desktop popout, at a fixed size. */
        popout: "h-[min(680px,calc(100dvh-2rem))] max-w-[504px] rounded-md",
        /* The bottom sheet: full width, rising from the bottom edge. */
        sheet:
          "h-[var(--newt-app-launcher-sheet-height,90dvh)] max-w-none rounded-t-lg border-b-0",
      },
    },
    defaultVariants: { variant: "popout" },
  }
)

export interface AppLauncherProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof appLauncherVariants> {
  /**
   * Render the launcher in the page: no dialog role, and focus stays where it
   * is. Use it for a launcher that is always on screen, such as a showcase.
   */
  inline?: boolean
  /**
   * Take the page behind the launcher out of use: it is hidden from assistive
   * technology, focus cannot move to it, and a press on it closes the
   * launcher. Use it for a sheet that covers the page. Has no effect on an
   * `inline` launcher.
   */
  modal?: boolean
  /**
   * The accessible name of the launcher. Without it, name the launcher with
   * `aria-label` or `aria-labelledby`.
   */
  label?: string
  /**
   * Called when the user asks to close the dialog: Escape, or a press outside
   * a `modal` one. Unmount the launcher in answer; focus then returns to the
   * element that held it before the launcher opened.
   */
  onClose?: () => void
}

/*
 * Radix owns the behaviour: focus moves into the launcher, Tab cycles through
 * its controls, Escape asks to close it, and a `modal` one takes the page
 * behind it out of use. The launcher renders in place, with no portal and no
 * overlay, so the application decides where it sits. It is open for as long
 * as it is mounted.
 */
const AppLauncherDialog = React.forwardRef<
  HTMLDivElement,
  Omit<AppLauncherProps, "inline" | "variant"> & { variantClassName: string }
>(
  (
    {
      modal = false,
      label,
      onClose,
      variantClassName,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const opener = React.useRef<Element | null>(null)
    return (
      <DialogPrimitive.Root
        open
        modal={modal}
        onOpenChange={(open) => {
          if (!open) onClose?.()
        }}
      >
        <DialogPrimitive.Content
          ref={ref}
          aria-modal={modal ? true : undefined}
          aria-describedby={undefined}
          /*
           * Radix returns focus to a `Dialog.Trigger`, and this dialog has
           * none: the application opens it by mounting it. So the launcher
           * notes which element holds focus just before it takes it.
           */
          onOpenAutoFocus={() => {
            opener.current = document.activeElement
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            const element = opener.current
            if (element instanceof HTMLElement && element.isConnected)
              element.focus()
          }}
          /*
           * The page beside a dialog that is not modal stays in use, so a
           * press or a focus move outside must not close the launcher.
           */
          onInteractOutside={(event) => {
            if (!modal) event.preventDefault()
          }}
          className={cn(variantClassName, "outline-none", className)}
          {...props}
        >
          {/* The name, as a heading no one sees: Radix points the dialog at it. */}
          {label === undefined ? null : (
            <DialogPrimitive.Title className="sr-only">
              {label}
            </DialogPrimitive.Title>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Root>
    )
  }
)
AppLauncherDialog.displayName = "AppLauncherDialog"

/*
 * The Apps launcher: search, recents, and the apps installed in a server. It
 * is a popout on desktop and a bottom sheet on a phone, and a dialog unless
 * it is `inline`.
 */
const AppLauncher = React.forwardRef<HTMLDivElement, AppLauncherProps>(
  ({ inline = false, variant, ...props }, ref) => {
    const variantClassName = appLauncherVariants({ variant })
    if (!inline)
      return (
        <AppLauncherDialog
          ref={ref}
          variantClassName={variantClassName}
          {...props}
        />
      )
    const { modal: _modal, onClose: _onClose, label, role, ...rest } = props
    return (
      <div
        ref={ref}
        /* A name needs a role to hang on: a `div` alone may not carry one. */
        role={role ?? (label === undefined ? undefined : "region")}
        aria-label={label}
        {...rest}
        className={cn(variantClassName, rest.className)}
      />
    )
  }
)
AppLauncher.displayName = "AppLauncher"

export interface AppLauncherHandleProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The accessible name of the handle. Pass it to render the handle as a
   * button that expands or collapses the sheet. Without it, the handle is a
   * decorative grip that assistive technology skips.
   */
  label?: string
  /** Whether the sheet is expanded, reported as `aria-expanded`. */
  expanded?: boolean
}

const gripClassName = "h-1 w-9 shrink-0 rounded-full bg-newt-border"

/* The element is picked at runtime, so the ref keeps its public type. */
function handleElement(interactive: boolean): React.ElementType {
  return interactive ? "button" : "div"
}

/*
 * Grip shown when the launcher is presented as a bottom sheet. With a
 * `label` it is a button: native, so Enter and Space press it.
 */
const AppLauncherHandle = React.forwardRef<HTMLElement, AppLauncherHandleProps>(
  ({ className, label, expanded, ...props }, ref) => {
    const interactive = label !== undefined
    const Tag = handleElement(interactive)
    return (
      <Tag
        ref={ref}
        type={interactive ? "button" : undefined}
        aria-label={label}
        aria-expanded={interactive ? expanded : undefined}
        aria-hidden={interactive ? undefined : true}
        className={cn(
          interactive
            ? "group mx-auto mt-1.5 flex h-6 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
            : cn("mx-auto mt-2", gripClassName),
          className
        )}
        {...props}
      >
        {interactive ? (
          <span
            aria-hidden="true"
            className={cn(gripClassName, "group-hover:bg-newt-text-muted")}
          />
        ) : null}
      </Tag>
    )
  }
)
AppLauncherHandle.displayName = "AppLauncherHandle"

/* Drill-in header: back control on the left, view title beside it. */
const AppLauncherHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-14 shrink-0 items-center gap-2 px-2 text-base font-semibold",
      className
    )}
    {...props}
  />
))
AppLauncherHeader.displayName = "AppLauncherHeader"

/*
 * Title of a drill-in view. It takes the free width and centres in it, so put
 * a spacer as wide as the back control after it to centre it in the header.
 */
const AppLauncherHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "m-0 min-w-0 flex-1 truncate text-center text-base font-semibold text-newt-text-primary",
      className
    )}
    {...props}
  />
))
AppLauncherHeaderTitle.displayName = "AppLauncherHeaderTitle"

const AppLauncherBack = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-newt-bg-elevated p-0 text-newt-text-secondary transition-colors duration-fast ease-newt",
      "hover:bg-newt-bg-hover hover:text-newt-text-primary",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
AppLauncherBack.displayName = "AppLauncherBack"

const SearchIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-newt-text-muted"
  >
    <circle cx="9" cy="9" r="5.5" />
    <path d="M13 13l4 4" />
  </svg>
)

/* Search field wrapper; place an `<AppLauncherSearchInput>` inside it. */
const AppLauncherSearch = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 px-4 pb-3 pt-4", className)}
    {...props}
  >
    <div className="relative flex items-center">
      <SearchIcon />
      {children}
    </div>
  </div>
))
AppLauncherSearch.displayName = "AppLauncherSearch"

export interface AppLauncherSearchInputProps extends React.ComponentProps<"input"> {
  /** Called with the text of the field on each change, after `onChange`. */
  onValueChange?: (value: string) => void
}

/* Pass `value` and `onValueChange` to control the query. */
const AppLauncherSearchInput = React.forwardRef<
  HTMLInputElement,
  AppLauncherSearchInputProps
>(({ className, type = "search", onChange, onValueChange, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    autoComplete="off"
    spellCheck={false}
    className={cn(
      "h-11 w-full appearance-none rounded-md border-2 border-transparent bg-newt-bg-input py-0 ps-11 pe-3 text-base text-newt-text-primary outline-none",
      "placeholder:text-newt-text-muted focus:border-newt-brand",
      className
    )}
    onChange={(event) => {
      onChange?.(event)
      onValueChange?.(event.target.value)
    }}
    {...props}
  />
))
AppLauncherSearchInput.displayName = "AppLauncherSearchInput"

const AppLauncherBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4",
      scrollbarClassName,
      className
    )}
    {...props}
  />
))
AppLauncherBody.displayName = "AppLauncherBody"

const AppLauncherSection = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"section">
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
))
AppLauncherSection.displayName = "AppLauncherSection"

const AppLauncherSectionHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between gap-2 px-0.5", className)}
    {...props}
  />
))
AppLauncherSectionHeader.displayName = "AppLauncherSectionHeader"

const AppLauncherSectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "m-0 inline-flex items-center gap-1 text-base font-medium text-newt-text-primary",
      className
    )}
    {...props}
  />
))
AppLauncherSectionTitle.displayName = "AppLauncherSectionTitle"

const AppLauncherViewMore = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "cursor-pointer rounded-sm border-0 bg-transparent p-0 text-base font-semibold text-newt-text-link no-underline hover:underline",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
AppLauncherViewMore.displayName = "AppLauncherViewMore"

export interface AppLauncherListProps extends React.ComponentProps<"div"> {
  /**
   * `stack` puts rows behind one rounded surface. `grid` lays out
   * `variant="tile"` items in columns.
   */
  variant?: "stack" | "grid"
}

/* Card that stacks `<AppLauncherItem>` rows behind one rounded surface. */
const AppLauncherList = React.forwardRef<HTMLDivElement, AppLauncherListProps>(
  ({ className, variant = "stack", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        variant === "grid"
          ? "grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2"
          : "flex flex-col overflow-hidden rounded-md bg-newt-bg-elevated [&>*+*]:border-t [&>*+*]:border-newt-border",
        className
      )}
      {...props}
    />
  )
)
AppLauncherList.displayName = "AppLauncherList"

export interface AppLauncherItemProps extends Omit<
  React.ComponentProps<"button">,
  "children"
> {
  name: string
  description?: string
  /** Icon for the app; pair with `<AppLauncherItemIcon>`. */
  icon?: React.ReactNode
  /** Marks a paid placement, as the client does for promoted apps. */
  promoted?: boolean
  /**
   * Content after the text, such as a chevron or a visibility toggle. It sits
   * beside the item's button, so it can hold a control of its own.
   */
  trailing?: React.ReactNode
  /**
   * `row` puts the icon beside the text. `tile` puts it above, for a
   * `variant="grid"` list.
   */
  variant?: "row" | "tile"
}

/*
 * The row is a wrapper that holds the item's button and, beside it, the
 * `trailing` content. A control in `trailing` is then not nested in the
 * button. The button's `::after` covers the whole row, so a press anywhere
 * else on the row, a chevron included, presses the button. `className`
 * styles the row; the ref and the other props go to the button.
 */
const AppLauncherItem = React.forwardRef<
  HTMLButtonElement,
  AppLauncherItemProps
>(
  (
    {
      className,
      name,
      description,
      icon,
      promoted = false,
      trailing,
      variant = "row",
      type = "button",
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        "relative flex w-full items-center transition-colors duration-fast ease-newt",
        variant === "tile"
          ? "flex-col gap-2 rounded-md bg-newt-bg-elevated px-2 py-3"
          : "gap-3 px-3 py-3",
        "hover:bg-newt-bg-hover",
        className
      )}
    >
      <button
        ref={ref}
        type={type}
        className={cn(
          "flex min-w-0 cursor-pointer items-center border-0 bg-transparent p-0 outline-none",
          variant === "tile"
            ? "w-full flex-col gap-2 text-center after:rounded-md"
            : "flex-1 gap-3 text-start",
          "after:absolute after:inset-0",
          "focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-newt-text-link"
        )}
        {...props}
      >
        {icon}
        <span
          className={cn(
            "flex min-w-0 flex-col gap-0.5",
            variant === "tile" ? "w-full" : "flex-1"
          )}
        >
          <span
            className={cn(
              "flex min-w-0 items-center gap-1.5",
              variant === "tile" && "justify-center"
            )}
          >
            <span className="truncate text-base font-medium leading-tight text-newt-text-primary">
              {name}
            </span>
            {promoted ? (
              <span className="shrink-0 rounded-full bg-newt-text-primary px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-newt-bg-surface">
                Promoted
              </span>
            ) : null}
          </span>
          {description ? (
            <span className="truncate text-sm leading-snug text-newt-text-muted">
              {description}
            </span>
          ) : null}
        </span>
      </button>
      {trailing ? (
        /* A press passes through to the button, unless it lands on a control. */
        <span className="pointer-events-none inline-flex shrink-0 items-center gap-1 text-newt-text-muted [&>svg]:h-5 [&>svg]:w-5 [&_:is(a,button,input,label,select,textarea)]:pointer-events-auto [&_:is(a,button,input,label,select,textarea)]:relative">
          {trailing}
        </span>
      ) : null}
    </div>
  )
)
AppLauncherItem.displayName = "AppLauncherItem"

export interface AppLauncherItemIconProps extends React.ComponentProps<"span"> {
  /** Bots use circular avatars; games and activities keep the squircle. */
  round?: boolean
  /**
   * How an `<img>` inside fills the icon: `cover` crops it, `contain`
   * shows all of it, for a logo that must not be cut.
   */
  fit?: "cover" | "contain"
}

const AppLauncherItemIcon = React.forwardRef<
  HTMLSpanElement,
  AppLauncherItemIconProps
>(({ className, round = false, fit = "cover", ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-newt-bg-base text-newt-text-secondary",
      round ? "rounded-full" : "rounded-[10px]",
      "[&>img]:h-full [&>img]:w-full [&>svg]:h-5 [&>svg]:w-5",
      fit === "contain" ? "[&>img]:object-contain" : "[&>img]:object-cover",
      className
    )}
    {...props}
  />
))
AppLauncherItemIcon.displayName = "AppLauncherItemIcon"

/*
 * Horizontal strip of recently used apps, as a list: a screen reader
 * announces how many there are. Name it with `aria-label` or
 * `aria-labelledby`.
 */
const AppLauncherRecents = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, role = "list", ...props }, ref) => (
  <ul
    ref={ref}
    /* `list-style: none` drops the list role in Safari; this keeps it. */
    role={role}
    className={cn(
      "m-0 flex list-none gap-3 overflow-x-auto p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      className
    )}
    {...props}
  />
))
AppLauncherRecents.displayName = "AppLauncherRecents"

export interface AppLauncherRecentProps extends React.ComponentProps<"button"> {
  /**
   * How an `<img>` inside fills the tile: `cover` crops it, `contain`
   * shows all of it, for a logo that must not be cut.
   */
  fit?: "cover" | "contain"
}

/* One recent app: a list item holding the button the props apply to. */
const AppLauncherRecent = React.forwardRef<
  HTMLButtonElement,
  AppLauncherRecentProps
>(({ className, fit = "cover", type = "button", ...props }, ref) => (
  <li className="flex shrink-0">
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-0 bg-newt-bg-base p-0 text-newt-text-secondary transition-[filter] duration-fast ease-newt",
        "hover:brightness-110",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
        "[&>img]:h-full [&>img]:w-full [&>svg]:h-6 [&>svg]:w-6",
        fit === "contain" ? "[&>img]:object-contain" : "[&>img]:object-cover",
        className
      )}
      {...props}
    />
  </li>
))
AppLauncherRecent.displayName = "AppLauncherRecent"

export interface AppLauncherPromoCardProps extends Omit<
  React.ComponentProps<"button">,
  "children"
> {
  /** The artwork across the top. An `<img>` fills it and is cropped. */
  art?: React.ReactNode
  /** The row below the art, such as an icon, the app name and a line. */
  footer?: React.ReactNode
}

/* A promoted app: art on top, a footer with its name below. */
const AppLauncherPromoCard = React.forwardRef<
  HTMLButtonElement,
  AppLauncherPromoCardProps
>(({ className, art, footer, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded-md border-0 bg-newt-bg-elevated p-0 text-start text-newt-text-primary transition-colors duration-fast ease-newt",
      "hover:bg-newt-bg-hover",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  >
    {art ? (
      <span className="block aspect-video overflow-hidden bg-newt-bg-base [&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover">
        {art}
      </span>
    ) : null}
    {footer ? (
      <span className="flex min-w-0 items-center gap-3 p-3">{footer}</span>
    ) : null}
  </button>
))
AppLauncherPromoCard.displayName = "AppLauncherPromoCard"

export {
  AppLauncher,
  appLauncherVariants,
  AppLauncherHandle,
  AppLauncherHeader,
  AppLauncherHeaderTitle,
  AppLauncherBack,
  AppLauncherSearch,
  AppLauncherSearchInput,
  AppLauncherBody,
  AppLauncherSection,
  AppLauncherSectionHeader,
  AppLauncherSectionTitle,
  AppLauncherViewMore,
  AppLauncherList,
  AppLauncherItem,
  AppLauncherItemIcon,
  AppLauncherRecents,
  AppLauncherRecent,
  AppLauncherPromoCard,
}
