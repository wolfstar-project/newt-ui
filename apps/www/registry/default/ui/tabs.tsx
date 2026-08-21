"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string | undefined
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext(component: string): TabsContextValue {
  const ctx = React.useContext(TabsContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Tabs>`)
  }
  return ctx
}

export interface TabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue"
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    { className, value, defaultValue, onValueChange, children, ...props },
    ref
  ) => {
    const [internal, setInternal] = React.useState<string | undefined>(
      defaultValue
    )
    const isControlled = value !== undefined
    const current = isControlled ? value : internal

    const setValue = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange]
    )

    const ctx = React.useMemo(
      () => ({ value: current, setValue }),
      [current, setValue]
    )

    return (
      <TabsContext.Provider value={ctx}>
        <div
          ref={ref}
          role="tablist"
          className={cn(
            "flex w-fit gap-1 rounded-md bg-newt-bg-base p-1",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

export interface TabsTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, onClick, ...props }, ref) => {
    const ctx = useTabsContext("TabsTrigger")
    const active = ctx.value === value
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        data-state={active ? "active" : "inactive"}
        tabIndex={active ? 0 : -1}
        className={cn(
          "cursor-pointer rounded-sm border-0 bg-transparent px-3.5 py-1.5 text-[13px] font-medium text-newt-text-muted transition-all duration-fast ease-newt",
          "data-[state=active]:bg-newt-bg-elevated data-[state=active]:text-newt-text-primary",
          "data-[state=inactive]:hover:text-newt-text-secondary",
          className
        )}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) ctx.setValue(value)
        }}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = useTabsContext("TabsContent")
    if (ctx.value !== value) return null
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state="active"
        className={cn("mt-2", className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsTrigger, TabsContent }
