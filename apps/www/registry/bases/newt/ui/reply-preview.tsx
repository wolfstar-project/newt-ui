import * as React from "react"

import { cn } from "@/lib/utils"

const ReplyPreview = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mb-1 flex min-w-0 items-center gap-1.5 ps-[18px] text-[13px] leading-4 text-newt-text-muted",
      /* The elbow that hooks the preview back up to the message above it. */
      "before:absolute before:start-0 before:top-1/2 before:h-3 before:w-3 before:-translate-y-full before:rounded-ss-[6px] before:border-s-2 before:border-t-2 before:border-newt-border before:content-['']",
      /*
       * In the reply slot of a message group the preview has no margin and no
       * padding: the row sets the distance to the author line. The reach is
       * the distance from the preview back to the centre of the avatar, from
       * the two properties the group publishes. The fallbacks are the values
       * of a group that does not publish them.
       */
      "[[data-slot=message-reply]_&]:mb-0 [[data-slot=message-reply]_&]:ps-0 [[data-slot=message-reply]_&]:[--newt-reply-spine-reach:calc(var(--newt-message-group-avatar-size,40px)_/_2_+_var(--newt-message-group-gap,16px))]",
      /*
       * There the spine leaves the preview. It starts above the centre of the
       * avatar, half a stroke back so the 2px stroke is centred, and stops
       * 4px before the preview.
       */
      "[[data-slot=message-reply]_&]:before:bottom-0 [[data-slot=message-reply]_&]:before:end-[calc(100%_+_4px)] [[data-slot=message-reply]_&]:before:start-[calc(-1_*_var(--newt-reply-spine-reach)_-_1px)] [[data-slot=message-reply]_&]:before:top-[calc(50%_-_1px)] [[data-slot=message-reply]_&]:before:h-auto [[data-slot=message-reply]_&]:before:w-auto [[data-slot=message-reply]_&]:before:translate-y-0",
      className
    )}
    {...props}
  />
))
ReplyPreview.displayName = "ReplyPreview"

export interface ReplyPreviewAvatarProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "children"
> {
  /**
   * The fallback, drawn when there is no `src` and no `srcSet`: an icon or
   * initials in a
   * 16px circle. The circle sizes an `svg` to 10px.
   */
  children?: React.ReactNode
}

/*
 * The avatar of the referenced author. With a `src` or a `srcSet` it is an
 * image. Without either it is a circle that holds its children, so an avatar that is an icon
 * can be drawn. An empty `alt` hides either form from a screen reader.
 */
const ReplyPreviewAvatar = React.forwardRef<
  HTMLElement,
  ReplyPreviewAvatarProps
>(({ className, alt = "", src, srcSet, children, ...props }, ref) => {
  const decorative = alt === ""
  if (src !== undefined || srcSet !== undefined) {
    /*
     * `createElement` types the ref by the element it is given here, so the
     * one `HTMLElement` ref serves both forms without an assertion.
     */
    return React.createElement("img", {
      ref,
      src,
      srcSet,
      alt,
      "aria-hidden": decorative ? true : undefined,
      className: cn("h-4 w-4 shrink-0 rounded-full object-cover", className),
      ...props,
    })
  }
  return (
    <span
      ref={ref}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-newt-brand text-[9px] font-semibold text-newt-on-accent [&>svg]:h-2.5 [&>svg]:w-2.5",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})
ReplyPreviewAvatar.displayName = "ReplyPreviewAvatar"

const ReplyPreviewAuthor = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("shrink-0 font-medium text-newt-text-link", className)}
    {...props}
  />
))
ReplyPreviewAuthor.displayName = "ReplyPreviewAuthor"

const ReplyPreviewText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "min-w-0 max-w-[360px] truncate text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ReplyPreviewText.displayName = "ReplyPreviewText"

/* "used" — the verb between the author and an interaction chip. */
const ReplyPreviewAction = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("shrink-0", className)} {...props} />
))
ReplyPreviewAction.displayName = "ReplyPreviewAction"

export interface ReplyPreviewCommandProps extends React.ComponentProps<"span"> {
  /**
   * An icon before the command name. It sits outside the truncating label,
   * so the gap of the chip applies and the icon never clips.
   */
  icon?: React.ReactNode
}

/* The command chip shown when the reply is a slash-command interaction. */
const ReplyPreviewCommand = React.forwardRef<
  HTMLSpanElement,
  ReplyPreviewCommandProps
>(({ className, icon, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex min-w-0 items-center gap-0.5 rounded-sm bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] px-1 font-medium text-newt-mention-text [&>svg]:h-3 [&>svg]:w-3 [&>svg]:shrink-0",
      className
    )}
    {...props}
  >
    {icon}
    <span className="truncate">{children}</span>
  </span>
))
ReplyPreviewCommand.displayName = "ReplyPreviewCommand"

export {
  ReplyPreview,
  ReplyPreviewAvatar,
  ReplyPreviewAuthor,
  ReplyPreviewText,
  ReplyPreviewAction,
  ReplyPreviewCommand,
}
