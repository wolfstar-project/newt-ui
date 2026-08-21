"use client"

import * as React from "react"

import {
  SelectMenu,
  SelectMenuLabel,
  SelectMenuOption,
  SelectMenuSearch,
} from "@/registry/default/ui/select-menu"

const options = ["Option one", "Option two", "Option three"]

export default function SelectMenuDemo() {
  const [selected, setSelected] = React.useState(options[0])
  const [query, setQuery] = React.useState("")

  const visible = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <SelectMenu aria-label="Select an option">
      <SelectMenuSearch
        placeholder="Search…"
        aria-label="Search options"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <SelectMenuLabel>Options</SelectMenuLabel>
      {visible.map((option) => (
        <SelectMenuOption
          key={option}
          selected={option === selected}
          onClick={() => setSelected(option)}
        >
          {option}
        </SelectMenuOption>
      ))}
    </SelectMenu>
  )
}
