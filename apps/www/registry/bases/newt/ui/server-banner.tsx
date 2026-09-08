import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const ServerBanner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex max-w-[480px] items-center gap-4 rounded-lg border border-newt-border bg-newt-bg-elevated px-5 py-4",
      className
    )}
    {...props}
  />
))
ServerBanner.displayName = "ServerBanner"

const ServerBannerIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-newt-brand text-[22px] font-bold text-white",
      className
    )}
    {...props}
  />
))
ServerBannerIcon.displayName = "ServerBannerIcon"

const ServerBannerInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
))
ServerBannerInfo.displayName = "ServerBannerInfo"

const ServerBannerName = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-bold text-newt-text-primary", className)}
    {...props}
  />
))
ServerBannerName.displayName = "ServerBannerName"

const ServerBannerMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-[2px] flex items-center gap-3 text-[13px] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ServerBannerMeta.displayName = "ServerBannerMeta"

const serverBannerDotVariants = cva("h-2 w-2 shrink-0 rounded-full", {
  variants: {
    status: {
      online: "bg-newt-online",
      offline: "bg-newt-offline",
    },
  },
  defaultVariants: {
    status: "offline",
  },
})

export interface ServerBannerMetaItemProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof serverBannerDotVariants> {}

const ServerBannerMetaItem = React.forwardRef<
  HTMLSpanElement,
  ServerBannerMetaItemProps
>(({ className, status, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex items-center gap-[5px]", className)}
    {...props}
  >
    <span className={serverBannerDotVariants({ status })} aria-hidden="true" />
    {children}
  </span>
))
ServerBannerMetaItem.displayName = "ServerBannerMetaItem"

export {
  ServerBanner,
  ServerBannerIcon,
  ServerBannerInfo,
  ServerBannerName,
  ServerBannerMeta,
  ServerBannerMetaItem,
  serverBannerDotVariants,
}
