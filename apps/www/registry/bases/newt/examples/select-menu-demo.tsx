"use client"

import * as React from "react"

import { SelectMenu } from "@/registry/bases/newt/ui/select-menu"

/*
 * Drawn here rather than pulled from an icon package: the registry ships no
 * runtime dependency, and a device picker needs exactly two glyphs.
 */
const Monitor = () => (
  <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
    <path
      fill="currentColor"
      d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6v2h3a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h3v-2H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2v7h14V7H5Z"
    />
  </svg>
)

const Headset = () => (
  <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 3a8 8 0 0 0-8 8v6a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H6v-1a6 6 0 1 1 12 0v1h-2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1a3 3 0 0 0 3-3v-6a8 8 0 0 0-8-8Z"
    />
  </svg>
)

const OPTIONS = [
  {
    value: "default",
    label: "Windows Default",
    description: "Odyssey G85SD (NVIDIA High Definition Audio)",
    note: "(Odyssey G85SD)",
    icon: <Monitor />,
  },
  {
    value: "odyssey",
    label: "Odyssey G85SD",
    description: "NVIDIA High Definition Audio",
    icon: <Monitor />,
  },
  {
    value: "oculus",
    label: "Cuffie",
    description: "Oculus Virtual Audio Device",
    icon: <Headset />,
  },
  {
    value: "voicemod",
    label: "Linea",
    description: "Voicemod Virtual Audio Device (WDM)",
    icon: <Headset />,
    disabled: true,
  },
]

export default function SelectMenuDemo() {
  const [value, setValue] = React.useState<string>("default")

  return (
    <SelectMenu
      options={OPTIONS}
      value={value}
      onValueChange={setValue}
      label="Output device"
    />
  )
}
