import { useId, useState, type ReactNode } from "react"

import { cn } from "../lib/utils"

interface TabDef {
  readonly value: string
  readonly label: string
  readonly content: ReactNode
}

interface TabsProps {
  readonly tabs: readonly [TabDef, TabDef, ...TabDef[]]
  readonly className?: string
}

/*
 * Two panes sharing one frame, never more: Preview/Code on a component page,
 * CLI/Manual on an installation step. A `role="tablist"` of two buttons is
 * the whole API a reader needs, so this stays a plain toggle rather than
 * reaching for full ARIA tab keyboard navigation.
 */
export function Tabs({ tabs, className }: TabsProps) {
  const [active, setActive] = useState(tabs[0].value)
  const id = useId()
  const current = tabs.find((tab) => tab.value === active) ?? tabs[0]

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div role="tablist" className="inline-flex w-fit border border-reed">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${id}-${tab.value}-tab`}
            aria-selected={tab.value === active}
            aria-controls={`${id}-${tab.value}-panel`}
            onClick={() => setActive(tab.value)}
            className={cn(
              "px-3 py-1.5 font-data text-[12px] tracking-[0.02em] transition-colors duration-(--dur-instant) ease-(--ease-beat)",
              tab.value === active
                ? "bg-shed text-weft"
                : "text-weft-dim hover:text-weft"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-${current.value}-panel`}
        aria-labelledby={`${id}-${current.value}-tab`}
      >
        {current.content}
      </div>
    </div>
  )
}
