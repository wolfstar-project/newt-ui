"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  CommandPalette,
  type CommandGroup,
} from "@/registry/bases/newt/ui/command-palette"

const GROUPS: readonly CommandGroup[] = [
  {
    label: "Channels",
    items: [
      {
        id: "general",
        label: "general",
        prefix: "#",
        description: "Community",
      },
      {
        id: "release-notes",
        label: "release-notes",
        prefix: "#",
        description: "Announcements",
      },
      { id: "help", label: "help", prefix: "#", description: "Support" },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        id: "settings",
        label: "Server settings",
        prefix: "⚙",
        shortcut: "Ctrl ,",
        keywords: ["preferences", "config"],
      },
      { id: "mention", label: "Mention a member", prefix: "@" },
    ],
  },
]

export default function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false)
  const [last, setLast] = React.useState("Nothing chosen yet")

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open quick switcher
      </Button>
      <p className="m-0 text-xs text-newt-text-muted" aria-live="polite">
        {last}
      </p>
      <CommandPalette
        label="Quick switcher"
        open={open}
        onOpenChange={setOpen}
        groups={GROUPS}
        onSelect={(item) => setLast(`Went to ${item.label}`)}
      />
    </div>
  )
}
