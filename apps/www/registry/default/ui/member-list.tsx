import * as React from "react"

import { cn } from "@/lib/utils"

const MemberList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="list"
    className={cn("flex flex-col", className)}
    {...props}
  />
))
MemberList.displayName = "MemberList"

const MemberListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="listitem"
    className={cn(
      "flex cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors duration-fast ease-newt hover:bg-newt-bg-hover",
      className
    )}
    {...props}
  />
))
MemberListItem.displayName = "MemberListItem"

const MemberListInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 flex-col leading-[1.2]", className)}
    {...props}
  />
))
MemberListInfo.displayName = "MemberListInfo"

export interface MemberListNameProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Render the name in the brand colour (e.g. highlighted role). */
  colored?: boolean
}

const MemberListName = React.forwardRef<HTMLSpanElement, MemberListNameProps>(
  ({ className, colored = false, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "truncate text-sm font-medium",
        colored ? "text-newt-brand" : "text-newt-text-primary",
        className
      )}
      {...props}
    />
  )
)
MemberListName.displayName = "MemberListName"

const MemberListRole = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("truncate text-xs text-newt-text-muted", className)}
    {...props}
  />
))
MemberListRole.displayName = "MemberListRole"

export {
  MemberList,
  MemberListItem,
  MemberListInfo,
  MemberListName,
  MemberListRole,
}
