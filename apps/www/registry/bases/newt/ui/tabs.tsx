"use client"

import { Tabs as TabsPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Radix owns the behaviour: roving focus, arrow keys, Home and End, and the
 * tab/panel ids that link each pair. Only the look is newt/ui's.
 */
const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex w-fit gap-1 rounded-md bg-newt-bg-base p-1", className)}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "cursor-pointer rounded-sm border-0 bg-transparent px-3.5 py-1.5 text-[13px] font-medium text-newt-text-muted transition-all duration-fast ease-newt",
      "data-[state=active]:bg-newt-bg-elevated data-[state=active]:text-newt-text-primary",
      "data-[state=inactive]:hover:text-newt-text-secondary",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-newt-text-link",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
