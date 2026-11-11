"use client"

import * as React from "react"

import { PinInput } from "@/registry/bases/newt/ui/pin-input"

export default function PinInputDemo() {
  const [code, setCode] = React.useState("481")
  const [status, setStatus] = React.useState("Enter the 6-digit code")

  return (
    <div className="flex flex-col items-center gap-3">
      <PinInput
        label="Two-factor code"
        groupSize={3}
        value={code}
        onValueChange={(next) => {
          setCode(next)
          if (next.length < 6) setStatus("Enter the 6-digit code")
        }}
        onComplete={(next) => setStatus(`Checking ${next}…`)}
      />
      <p className="text-xs text-newt-text-muted" aria-live="polite">
        {status}
      </p>
    </div>
  )
}
