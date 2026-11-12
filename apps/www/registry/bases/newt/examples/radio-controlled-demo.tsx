"use client"

import * as React from "react"

import { Radio, RadioGroup } from "@/registry/bases/newt/ui/radio"

export default function RadioControlledDemo() {
  const [display, setDisplay] = React.useState("cozy")

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <RadioGroup
        label="Message display"
        value={display}
        onValueChange={setDisplay}
      >
        <Radio value="cozy">Cozy</Radio>
        <Radio value="compact">Compact</Radio>
      </RadioGroup>
      <p
        className="rounded-md bg-newt-bg-elevated px-3 py-2 text-sm text-newt-text-secondary"
        aria-live="polite"
      >
        {display === "compact"
          ? "Avatars are hidden and more messages fit on the screen."
          : "Avatars are shown and messages have room to breathe."}
      </p>
    </div>
  )
}
