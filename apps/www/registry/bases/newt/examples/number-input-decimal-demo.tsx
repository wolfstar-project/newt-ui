"use client"

import * as React from "react"

import { Field, FieldHelp, Label } from "@/registry/bases/newt/ui/form-fields"
import { NumberInput } from "@/registry/bases/newt/ui/number-input"

/* The value keeps as many decimals as the step has, and no more. */
export default function NumberInputDecimalDemo() {
  const [speed, setSpeed] = React.useState(1)

  return (
    <Field className="items-start">
      <Label htmlFor="newt-number-input-decimal">Playback speed</Label>
      <NumberInput
        id="newt-number-input-decimal"
        min={0.25}
        max={2}
        step={0.25}
        value={speed}
        onValueChange={setSpeed}
        decrementLabel="Slower"
        incrementLabel="Faster"
      />
      <FieldHelp>
        {speed === 1
          ? "Voice messages play at normal speed."
          : `Voice messages play at ${speed}× speed.`}
      </FieldHelp>
    </Field>
  )
}
