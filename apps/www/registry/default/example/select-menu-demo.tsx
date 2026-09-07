"use client"

import * as React from "react"

import { SelectMenu } from "@/registry/default/ui/select-menu"

const OPTIONS = [
  { value: "one", label: "Option one", description: "What this option does" },
  { value: "two", label: "Option two" },
  { value: "three", label: "Option three", disabled: true },
]

export default function SelectMenuDemo() {
  const [value, setValue] = React.useState<string>()

  return (
    <SelectMenu
      options={OPTIONS}
      value={value}
      onValueChange={setValue}
      label="Select an option"
    />
  )
}
