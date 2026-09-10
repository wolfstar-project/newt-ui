"use client"

import * as React from "react"

import { EntitySelect } from "@/registry/bases/newt/ui/entity-select"

/* A face, drawn rather than fetched, so the demo holds up offline. */
function avatar(hue: number) {
  return (
    <span
      className="h-full w-full rounded-full"
      style={{ background: `hsl(${hue} 60% 45%)` }}
    />
  )
}

/* The glyph a text channel is known by. */
const hash = (
  <svg viewBox="0 0 24 24" className="h-full w-full text-newt-text-muted">
    <path
      fill="currentColor"
      d="M10.2 3a1 1 0 0 1 1 1.15L10.83 7h3.98l.43-2.85a1 1 0 1 1 1.98.3L16.83 7H19a1 1 0 1 1 0 2h-2.47l-.6 4H18a1 1 0 1 1 0 2h-2.37l-.44 2.85a1 1 0 1 1-1.98-.3l.39-2.55h-3.98l-.43 2.85a1 1 0 1 1-1.98-.3L7.6 15H5a1 1 0 1 1 0-2h2.9l.6-4H6a1 1 0 0 1 0-2h2.8l.43-2.85A1 1 0 0 1 10.2 3Zm-.7 6-.6 4h3.98l.6-4H9.5Z"
    />
  </svg>
)

export default function EntitySelectDemo() {
  const [chosen, setChosen] = React.useState<readonly string[]>([])

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-3">
      <EntitySelect
        kind="user"
        label="Choose a user"
        placeholder="Select a user"
        value={chosen}
        onValueChange={setChosen}
        options={[
          { value: "1", label: "someone", icon: avatar(210) },
          { value: "2", label: "a helper", icon: avatar(280), badge: "App" },
          { value: "3", label: "another", icon: avatar(140) },
        ]}
      />
      <EntitySelect
        kind="channel"
        label="Which text channel?"
        placeholder="Which text channel?"
        options={[
          { value: "general", label: "general", icon: hash },
          { value: "dev-chat", label: "dev-chat", icon: hash },
          { value: "playtesting", label: "playtesting", icon: hash },
        ]}
      />
    </div>
  )
}
