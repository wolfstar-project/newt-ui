"use client"

import * as React from "react"

import { Field, FieldHelp, Label } from "@/registry/bases/newt/ui/form-fields"
import { NumberInput } from "@/registry/bases/newt/ui/number-input"

const CONNECTED = 12

/*
 * `min` and `max` clamp what the control can say; `invalid` is for a rule the
 * control cannot know, such as how many people are already in the channel.
 */
export default function NumberInputInvalidDemo() {
  const [limit, setLimit] = React.useState(8)
  const invalid = limit < CONNECTED

  return (
    <Field className="items-start">
      <Label htmlFor="newt-number-input-invalid">User limit</Label>
      <NumberInput
        id="newt-number-input-invalid"
        min={1}
        max={99}
        value={limit}
        onValueChange={setLimit}
        invalid={invalid}
        aria-describedby="newt-number-input-invalid-help"
      />
      {invalid ? (
        <FieldHelp id="newt-number-input-invalid-help" variant="error">
          {CONNECTED} members are connected. Pick {CONNECTED} or more.
        </FieldHelp>
      ) : (
        <FieldHelp id="newt-number-input-invalid-help">
          Up to {limit} members can join this voice channel.
        </FieldHelp>
      )}
    </Field>
  )
}
