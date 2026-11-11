"use client"

import * as React from "react"

import { Button, buttonVariants } from "@/registry/bases/newt/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/newt/ui/popover"

export default function PopoverDemo() {
  const [open, setOpen] = React.useState(false)
  const [muted, setMuted] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={buttonVariants({ variant: "secondary" })}>
        Notification settings
      </PopoverTrigger>
      <PopoverContent aria-label="Notification settings">
        <p className="m-0 font-semibold text-newt-text-primary">
          {muted ? "This channel is muted" : "Mute this channel"}
        </p>
        <p className="m-0">
          You will not be notified unless you are mentioned.
        </p>
        <Button
          size="sm"
          variant={muted ? "secondary" : "primary"}
          onClick={() => {
            setMuted(!muted)
            setOpen(false)
          }}
        >
          {muted ? "Unmute" : "Mute for 1 hour"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
