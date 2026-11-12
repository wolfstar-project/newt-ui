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
 * The panel does not open itself. A button owns `open`, a wrapper the size of
 * the button is the positioning context, and the keyboard does what a menu
 * promises: opening moves focus to the first item, the arrows walk the items,
 * Enter or Space chooses one, and Escape closes and hands focus back.
 */
export default function DropdownTriggerDemo() {
  const [open, setOpen] = React.useState(false)
  const root = React.useRef<HTMLDivElement>(null)

  const items = () =>
    Array.from(
      root.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []
    )

  const close = () => {
    setOpen(false)
    root.current?.querySelector("button")?.focus()
  }

  React.useEffect(() => {
    if (open) items()[0]?.focus()
  }, [open])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) return
    const all = items()
    const at = all.findIndex((item) => item === document.activeElement)
    const last = all.length - 1

    if (event.key === "Escape") {
      close()
    } else if (event.key === "Tab") {
      setOpen(false)
    } else if ((event.key === "Enter" || event.key === " ") && at !== -1) {
      event.preventDefault()
      all[at]?.click()
    } else {
      const target = {
        ArrowDown: at >= last ? 0 : at + 1,
        ArrowUp: at <= 0 ? last : at - 1,
        Home: 0,
        End: last,
      }[event.key]
      if (target !== undefined) {
        event.preventDefault()
        all[target]?.focus()
      }
    }
  }

  return (
    <div className="min-h-52 w-60">
      <div className="relative inline-block" ref={root} onKeyDown={onKeyDown}>
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
              <DropdownItem key={action} onClick={close}>
                <DropdownLabel>{action}</DropdownLabel>
              </DropdownItem>
            ))}
            <DropdownDivider />
            <DropdownItem
              className="text-newt-danger hover:bg-newt-danger hover:text-newt-on-accent"
              onClick={close}
            >
              <DropdownLabel>Leave server</DropdownLabel>
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </div>
  )
}
