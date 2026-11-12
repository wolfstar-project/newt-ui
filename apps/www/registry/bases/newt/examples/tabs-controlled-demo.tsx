"use client"

import * as React from "react"

import { Tabs, TabsTrigger } from "@/registry/bases/newt/ui/tabs"

const TABS = [
  { value: "online", label: "Online", summary: "4 friends online" },
  { value: "all", label: "All", summary: "27 friends" },
  { value: "pending", label: "Pending", summary: "2 pending requests" },
]

/*
 * The active tab lives in the parent, so anything else on the page can read it
 * — or change it, as the button under the list does.
 */
export default function TabsControlledDemo() {
  const [tab, setTab] = React.useState("online")

  return (
    <div className="flex flex-col items-start gap-3">
      <Tabs value={tab} onValueChange={setTab}>
        {TABS.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </Tabs>
      <p className="text-sm text-newt-text-secondary">
        {TABS.find((item) => item.value === tab)?.summary}
      </p>
      <button
        type="button"
        className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-medium text-newt-text-link hover:underline"
        onClick={() => setTab("pending")}
      >
        Review pending requests
      </button>
    </div>
  )
}
