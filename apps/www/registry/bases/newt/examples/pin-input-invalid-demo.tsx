"use client"

import * as React from "react"

import { FieldHelp } from "@/registry/bases/newt/ui/form-fields"
import { PinInput } from "@/registry/bases/newt/ui/pin-input"

const EXPECTED = "204816"

/* The error clears as soon as the code is edited, not on the next submit. */
export default function PinInputInvalidDemo() {
  const [code, setCode] = React.useState("204861")
  const invalid = code.length === EXPECTED.length && code !== EXPECTED

  return (
    <div className="flex flex-col items-center gap-3">
      <PinInput
        label="Two-factor code"
        groupSize={3}
        value={code}
        onValueChange={setCode}
        invalid={invalid}
      />
      {invalid ? (
        <FieldHelp variant="error">
          That code did not match. Check it and try again.
        </FieldHelp>
      ) : (
        <FieldHelp>Enter the 6-digit code from your authenticator.</FieldHelp>
      )}
    </div>
  )
}
