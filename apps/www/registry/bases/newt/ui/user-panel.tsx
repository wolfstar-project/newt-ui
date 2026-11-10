"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The strip at the foot of a sidebar: who you are signed in as, and the two
 * or three controls that follow you everywhere. Put the avatar first, then
 * `UserPanelInfo`, then `UserPanelActions`.
 */
const UserPanel = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"section">
>(({ className, "aria-label": label = "User controls", ...props }, ref) => (
  <section
    ref={ref}
    aria-label={label}
    className={cn(
      "flex w-full items-center gap-2 rounded-md bg-newt-bg-base p-2",
      className
    )}
    {...props}
  />
))
UserPanel.displayName = "UserPanel"

export interface UserPanelInfoProps extends React.ComponentProps<"div"> {
  name: string
  /** The quieter line under the name: a status, a tag, an activity. */
  status?: string
}

const UserPanelInfo = React.forwardRef<HTMLDivElement, UserPanelInfoProps>(
  ({ className, name, status, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    >
      <span className="truncate text-sm font-semibold leading-[18px] text-newt-text-primary">
        {name}
      </span>
      {status === undefined ? null : (
        <span className="truncate text-xs leading-4 text-newt-text-muted">
          {status}
        </span>
      )}
    </div>
  )
)
UserPanelInfo.displayName = "UserPanelInfo"

const UserPanelActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex shrink-0", className)} {...props} />
))
UserPanelActions.displayName = "UserPanelActions"

export type UserPanelIcon = "microphone" | "headphones" | "settings"

export interface UserPanelButtonProps extends Omit<
  React.ComponentProps<"button">,
  "children"
> {
  icon: UserPanelIcon
  /** The button's accessible name; it has no visible text. */
  label: string
  /**
   * Makes the button a switch. On, the icon is struck through as well as
   * recoloured, so the state does not rest on colour.
   */
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const UserPanelButton = React.forwardRef<
  HTMLButtonElement,
  UserPanelButtonProps
>(
  (
    { className, icon, label, pressed, onPressedChange, onClick, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && pressed !== undefined) {
          onPressedChange?.(!pressed)
        }
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-sm text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link aria-pressed:text-newt-danger",
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[18px] w-[18px]">
        {icon === "microphone" ? (
          <>
            <path
              fill="currentColor"
              d="M8 1.5a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0v-4a2 2 0 0 0-2-2Z"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2.5"
            />
          </>
        ) : icon === "headphones" ? (
          <>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              d="M2.75 9.5V8a5.25 5.25 0 0 1 10.5 0v1.5"
            />
            <rect x="2" y="9" width="3" height="5" rx="1" fill="currentColor" />
            <rect
              x="11"
              y="9"
              width="3"
              height="5"
              rx="1"
              fill="currentColor"
            />
          </>
        ) : (
          <>
            <circle
              cx="8"
              cy="8"
              r="5.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeDasharray="2.2 1.88"
            />
            <circle
              cx="8"
              cy="8"
              r="2.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </>
        )}
        {pressed === true ? (
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            d="M2.5 2.5l11 11"
          />
        ) : null}
      </svg>
    </button>
  )
)
UserPanelButton.displayName = "UserPanelButton"

export { UserPanel, UserPanelInfo, UserPanelActions, UserPanelButton }
