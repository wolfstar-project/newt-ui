"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownItemLabel,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/registry/bases/newt/ui/dropdown"

const ACTIONS = ["Invite people", "Create channel", "Server settings"]

/*
 * `asChild` puts the menu state on your own button, and `open` with
 * `onOpenChange` lets the parent own it. `onSelect` reports the chosen item;
 * the menu then closes and hands focus back to the button by itself.
 */
export default function DropdownTriggerDemo() {
  const [open, setOpen] = React.useState(false)
  const [last, setLast] = React.useState("nothing yet")

  return (
    <div className="flex flex-col items-start gap-3">
      <Dropdown open={open} onOpenChange={setOpen}>
        <DropdownTrigger asChild>
          <Button variant="secondary">Server menu</Button>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownGroup>
            <DropdownLabel>Server</DropdownLabel>
            {ACTIONS.map((action) => (
              <DropdownItem key={action} onSelect={() => setLast(action)}>
                <DropdownItemLabel>{action}</DropdownItemLabel>
              </DropdownItem>
            ))}
          </DropdownGroup>
          <DropdownSeparator />
          <DropdownItem
            variant="danger"
            onSelect={() => setLast("Leave server")}
          >
            <DropdownItemLabel>Leave server</DropdownItemLabel>
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
      <p className="m-0 text-sm text-newt-text-muted" aria-live="polite">
        The menu is {open ? "open" : "closed"}. Last choice: {last}.
      </p>
    </div>
  )
}
