"use client"

import * as React from "react"

import {
  Field,
  FieldHelp,
  Label,
  Select,
} from "@/registry/bases/newt/ui/form-fields"

export default function FormFieldsSelectDemo() {
  const [duration, setDuration] = React.useState("1d")

  return (
    <Field className="w-full max-w-sm">
      <Label htmlFor="newt-select-example">Hide after inactivity</Label>
      <Select
        id="newt-select-example"
        value={duration}
        onChange={(event) => setDuration(event.target.value)}
      >
        <option value="1h">1 hour</option>
        <option value="1d">24 hours</option>
        <option value="3d">3 days</option>
        <option value="1w">1 week</option>
      </Select>
      <FieldHelp>
        Quiet threads leave the channel list after this long.
      </FieldHelp>
    </Field>
  )
}
