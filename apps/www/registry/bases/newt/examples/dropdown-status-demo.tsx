"use client"

import * as React from "react"

import {
  Dropdown,
  DropdownContent,
  DropdownDescription,
  DropdownIcon,
  DropdownItem,
  DropdownLabel,
} from "@/registry/bases/newt/ui/dropdown"

const STATUSES = [
  { value: "online", label: "Online", dot: "bg-newt-online" },
  { value: "idle", label: "Idle", dot: "bg-newt-idle" },
  {
    value: "dnd",
    label: "Do not disturb",
    description: "You will not get desktop notifications.",
    dot: "bg-newt-dnd",
  },
  {
    value: "invisible",
    label: "Invisible",
    description: "You appear offline but keep full access.",
    dot: "bg-newt-offline",
  },
]

/*
 * `active` marks the current choice. The menu keeps no state of its own, so
 * the parent holds the value and each item reports its click.
 */
export default function DropdownStatusDemo() {
  const [status, setStatus] = React.useState("online")

  return (
    <Dropdown aria-label="Status">
      {STATUSES.map((item) => (
        <DropdownItem
          key={item.value}
          role="menuitemradio"
          aria-checked={status === item.value}
          active={status === item.value}
          onClick={() => setStatus(item.value)}
        >
          <DropdownIcon>
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${item.dot}`}
            />
          </DropdownIcon>
          <DropdownContent>
            <DropdownLabel>{item.label}</DropdownLabel>
            {item.description && (
              <DropdownDescription>{item.description}</DropdownDescription>
            )}
          </DropdownContent>
        </DropdownItem>
      ))}
    </Dropdown>
  )
}
