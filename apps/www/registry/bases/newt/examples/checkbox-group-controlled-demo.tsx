"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  CheckboxGroup,
  CheckboxOption,
} from "@/registry/bases/newt/ui/checkbox-group"

const PERMISSIONS = [
  { value: "read", label: "Read messages" },
  { value: "send", label: "Send messages" },
  { value: "attach", label: "Attach files" },
  { value: "pin", label: "Pin messages" },
]

/*
 * With the value held outside, anything else on the page can write it: the
 * two buttons replace the whole selection in one step.
 */
export default function CheckboxGroupControlledDemo() {
  const [granted, setGranted] = React.useState<readonly string[]>([
    "read",
    "send",
  ])

  return (
    <div className="flex w-full max-w-[360px] flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-newt-text-muted" aria-live="polite">
          {granted.length} of {PERMISSIONS.length} granted
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setGranted(PERMISSIONS.map((each) => each.value))}
          >
            Grant all
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={granted.length === 0}
            onClick={() => setGranted([])}
          >
            Clear
          </Button>
        </div>
      </div>
      <CheckboxGroup
        label="Channel permissions"
        value={granted}
        onValueChange={setGranted}
      >
        {PERMISSIONS.map((permission) => (
          <CheckboxOption key={permission.value} value={permission.value}>
            {permission.label}
          </CheckboxOption>
        ))}
      </CheckboxGroup>
    </div>
  )
}
