"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
} from "@/registry/bases/newt/ui/dropdown"

const ACTIONS = ["Invite people", "Create channel", "Server settings"]

/*
 * The panel does not open itself. A button owns `open`, the wrapper is the
 * positioning context, and choosing an item or pressing Escape closes it.
 */
export default function DropdownTriggerDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className="relative min-h-52 w-60"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false)
      }}
    >
      <Button
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Server menu
      </Button>
      {open && (
        <Dropdown className="absolute start-0 top-[calc(100%+4px)] z-10">
          {ACTIONS.map((action) => (
            <DropdownItem key={action} onClick={() => setOpen(false)}>
              <DropdownLabel>{action}</DropdownLabel>
            </DropdownItem>
          ))}
          <DropdownDivider />
          <DropdownItem
            className="text-newt-danger hover:bg-newt-danger hover:text-newt-on-accent"
            onClick={() => setOpen(false)}
          >
            <DropdownLabel>Leave server</DropdownLabel>
          </DropdownItem>
        </Dropdown>
      )}
    </div>
  )
}
