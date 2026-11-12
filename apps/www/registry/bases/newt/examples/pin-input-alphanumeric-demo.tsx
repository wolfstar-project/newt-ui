"use client"

import * as React from "react"

import { PinInput } from "@/registry/bases/newt/ui/pin-input"

export default function PinInputAlphanumericDemo() {
  const [code, setCode] = React.useState("k7qd")

  return (
    <div className="flex flex-col items-center gap-3">
      <PinInput
        label="Backup code"
        type="alphanumeric"
        length={8}
        groupSize={4}
        value={code}
        onValueChange={setCode}
      />
      <p className="text-xs text-newt-text-muted" aria-live="polite">
        {code.length} of 8 characters
      </p>
    </div>
  )
}
