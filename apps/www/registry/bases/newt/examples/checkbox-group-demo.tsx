"use client"

import * as React from "react"

import {
  CheckboxGroup,
  CheckboxOption,
} from "@/registry/bases/newt/ui/checkbox-group"

export default function CheckboxGroupDemo() {
  const [days, setDays] = React.useState<readonly string[]>(["mon", "tue"])

  return (
    <CheckboxGroup
      className="w-full max-w-[360px]"
      label="Which days are you free?"
      value={days}
      onValueChange={setDays}
    >
      <CheckboxOption value="mon">Monday</CheckboxOption>
      <CheckboxOption value="tue">Tuesday</CheckboxOption>
      <CheckboxOption value="sat" description="Short notice, but possible">
        Saturday
      </CheckboxOption>
      <CheckboxOption value="sun" disabled>
        Sunday
      </CheckboxOption>
    </CheckboxGroup>
  )
}
