"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const channelInfoClassName =
  "flex h-full w-full max-w-sm flex-col overflow-hidden bg-newt-bg-surface text-newt-text-primary"

export interface ChannelInfoProps extends React.ComponentProps<"div"> {
  /**
   * Render a plain panel: no dialog role, and focus stays where it is. Use it
   * for a side panel that is always on screen.
   */
  inline?: boolean
  /**
   * Take the page beside the panel out of use: it is hidden from assistive
   * technology, focus cannot move to it, and a press on it closes the panel.
   * Use it when the panel covers the channel. Has no effect on an `inline`
   * panel.
   */
  modal?: boolean
  /**
   * The accessible name of the panel. Without it, name the panel with
   * `aria-label` or `aria-labelledby`.
   */
  label?: string
  /**
   * Called when the user asks to close the dialog: Escape, or a press outside
   * a `modal` one. Unmount the panel in answer; focus then returns to the
   * element that held it before the panel opened.
   */
  onClose?: () => void
}

/*
 * Radix owns the behaviour: focus moves into the panel, Tab cycles through
 * its controls, Escape asks to close it, and a `modal` one takes the page
 * behind it out of use. The panel renders in place, with no portal and no
 * overlay, so the application decides where it sits. It is open for as long
 * as it is mounted.
 */
const ChannelInfoDialog = React.forwardRef<
  HTMLDivElement,
  Omit<ChannelInfoProps, "inline">
>(({ modal = false, label, onClose, className, children, ...props }, ref) => {
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
         * none: the application opens it by mounting it. So the panel notes
         * which element holds focus just before it takes it.
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
         * The page beside a dialog that is not modal stays in use, so a press
         * or a focus move outside must not close the panel.
         */
        onInteractOutside={(event) => {
          if (!modal) event.preventDefault()
        }}
        className={cn(channelInfoClassName, "outline-none", className)}
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
})
ChannelInfoDialog.displayName = "ChannelInfoDialog"

/*
 * The panel that slides in over a channel on narrow screens, holding the
 * member list, pins, threads and the rest of the channel detail tabs. It is a
 * dialog unless it is `inline`.
 */
const ChannelInfo = React.forwardRef<HTMLDivElement, ChannelInfoProps>(
  ({ inline = false, ...props }, ref) => {
    if (!inline) return <ChannelInfoDialog ref={ref} {...props} />
    const { modal: _modal, onClose: _onClose, label, role, ...rest } = props
    return (
      <div
        ref={ref}
        /* A name needs a role to hang on: a `div` alone may not carry one. */
        role={role ?? (label === undefined ? undefined : "region")}
        aria-label={label}
        {...rest}
        className={cn(channelInfoClassName, rest.className)}
      />
    )
  }
)
ChannelInfo.displayName = "ChannelInfo"

const ChannelInfoToolbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-14 shrink-0 items-center justify-between gap-2 px-2",
      className
    )}
    {...props}
  />
))
ChannelInfoToolbar.displayName = "ChannelInfoToolbar"

const ChannelInfoActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
))
ChannelInfoActions.displayName = "ChannelInfoActions"

export interface ChannelInfoActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The element or component to render. Defaults to `button`, or to `a` when
   * `href` is set; pass a router link component to keep client navigation.
   * `span` renders the decorative form: hidden from assistive technology, out
   * of the tab order, with no pointer and no hover.
   */
  as?: React.ElementType
  /** Render a link to this URL. */
  href?: string
  /**
   * Turns the control off. A link loses its URL, which takes it out of the
   * tab order, and says so with `aria-disabled`.
   */
  disabled?: boolean
  /** Link target, with `href`. */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"]
  /** Link relationship, with `href`. */
  rel?: string
}

const ChannelInfoAction = React.forwardRef<HTMLElement, ChannelInfoActionProps>(
  ({ as, href, disabled, className, type = "button", ...props }, ref) => {
    const Tag: React.ElementType = as ?? (href === undefined ? "button" : "a")
    const isButton = Tag === "button"
    const decorative = Tag === "span"
    return (
      <Tag
        ref={ref}
        type={isButton ? type : undefined}
        href={decorative || disabled ? undefined : href}
        disabled={isButton ? disabled : undefined}
        aria-disabled={!isButton && !decorative && disabled ? true : undefined}
        aria-hidden={decorative ? true : undefined}
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-newt-text-secondary no-underline",
          !decorative &&
            "cursor-pointer transition-colors aria-disabled:pointer-events-none duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
          className
        )}
        {...props}
      />
    )
  }
)
ChannelInfoAction.displayName = "ChannelInfoAction"

const ChannelInfoIdentity = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 items-center gap-3 px-4 pb-3", className)}
    {...props}
  />
))
ChannelInfoIdentity.displayName = "ChannelInfoIdentity"

const ChannelInfoIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children = "#", ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-newt-bg-elevated text-lg font-bold leading-none text-newt-text-muted",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
ChannelInfoIcon.displayName = "ChannelInfoIcon"

const ChannelInfoName = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("truncate font-bold text-newt-text-primary", className)}
    {...props}
  />
))
ChannelInfoName.displayName = "ChannelInfoName"

const ChannelInfoType = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[13px] text-newt-text-muted", className)}
    {...props}
  />
))
ChannelInfoType.displayName = "ChannelInfoType"

/* Scrolling area under the tab strip. */
const ChannelInfoPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-h-0 flex-1 overflow-y-auto px-2 pb-4", className)}
    {...props}
  />
))
ChannelInfoPanel.displayName = "ChannelInfoPanel"

const ChannelInfoEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center gap-2 px-6 py-10 text-center",
      className
    )}
    {...props}
  />
))
ChannelInfoEmpty.displayName = "ChannelInfoEmpty"

const ChannelInfoEmptyIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-14 w-14 items-center justify-center rounded-full bg-newt-bg-elevated text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ChannelInfoEmptyIcon.displayName = "ChannelInfoEmptyIcon"

const ChannelInfoEmptyTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-semibold text-newt-text-primary", className)}
    {...props}
  />
))
ChannelInfoEmptyTitle.displayName = "ChannelInfoEmptyTitle"

const ChannelInfoEmptyBody = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("max-w-[36ch] text-sm text-newt-text-muted", className)}
    {...props}
  />
))
ChannelInfoEmptyBody.displayName = "ChannelInfoEmptyBody"

export {
  ChannelInfo,
  ChannelInfoToolbar,
  ChannelInfoActions,
  ChannelInfoAction,
  ChannelInfoIdentity,
  ChannelInfoIcon,
  ChannelInfoName,
  ChannelInfoType,
  ChannelInfoPanel,
  ChannelInfoEmpty,
  ChannelInfoEmptyIcon,
  ChannelInfoEmptyTitle,
  ChannelInfoEmptyBody,
}
