"use client"

import * as React from "react"

import { buttonVariants } from "@/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownIcon,
  DropdownItemDescription,
  DropdownItemLabel,
  DropdownItemText,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownTrigger,
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
 * The radio group holds the choice: the parent keeps the value and the group
 * reports each change. The checked item keeps the brand fill.
 */
export default function DropdownStatusDemo() {
  const [status, setStatus] = React.useState("online")
  const current = STATUSES.find((item) => item.value === status)

  return (
    <Dropdown>
      <DropdownTrigger className={buttonVariants({ variant: "secondary" })}>
        Status: {current?.label}
      </DropdownTrigger>
      <DropdownContent>
        <DropdownRadioGroup value={status} onValueChange={setStatus}>
          {STATUSES.map((item) => (
            <DropdownRadioItem key={item.value} value={item.value}>
              <DropdownIcon>
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${item.dot}`}
                />
              </DropdownIcon>
              <DropdownItemText>
                <DropdownItemLabel>{item.label}</DropdownItemLabel>
                {item.description && (
                  <DropdownItemDescription>
                    {item.description}
                  </DropdownItemDescription>
                )}
              </DropdownItemText>
            </DropdownRadioItem>
          ))}
        </DropdownRadioGroup>
      </DropdownContent>
    </Dropdown>
  )
}
