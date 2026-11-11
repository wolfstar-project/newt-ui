"use client"

import * as React from "react"

import { ColorPicker } from "@/registry/bases/newt/ui/color-picker"
import { RoleTag } from "@/registry/bases/newt/ui/role-tag"

export default function ColorPickerDemo() {
  const [colour, setColour] = React.useState("#1abc9c")

  return (
    <div className="flex flex-col items-start gap-3">
      <ColorPicker
        label="Role colour"
        value={colour}
        onValueChange={setColour}
      />
      <div className="flex items-center gap-2 text-xs text-newt-text-muted">
        <RoleTag color={colour}>Moderator</RoleTag>
        <span className="font-mono">{colour}</span>
      </div>
    </div>
  )
}
