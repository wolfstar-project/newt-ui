"use client"

import * as React from "react"

import { Field, FieldHelp, Label } from "@/registry/bases/newt/ui/form-fields"
import { NumberInput } from "@/registry/bases/newt/ui/number-input"

export default function NumberInputDemo() {
  const [seconds, setSeconds] = React.useState(15)

  return (
    <Field className="items-start">
      <Label htmlFor="newt-number-input-example">Slowmode</Label>
      <NumberInput
        id="newt-number-input-example"
        min={0}
        max={120}
        step={5}
        value={seconds}
        onValueChange={setSeconds}
      />
      <FieldHelp>
        {seconds === 0
          ? "Members can post freely."
          : `One message every ${seconds} seconds.`}
      </FieldHelp>
    </Field>
  )
}
