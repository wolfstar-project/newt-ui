"use client"

import * as React from "react"

import { Tree, type TreeNode } from "@/registry/bases/newt/ui/tree"

const CHANNELS: readonly TreeNode[] = [
  {
    id: "text",
    label: "Text channels",
    children: [
      { id: "general", label: "general", prefix: "#" },
      { id: "help", label: "help", prefix: "#", badge: 3 },
      { id: "release-notes", label: "release-notes", prefix: "#" },
    ],
  },
  {
    id: "voice",
    label: "Voice channels",
    children: [
      { id: "lounge", label: "Lounge", prefix: "🔊" },
      { id: "stage", label: "Town hall", prefix: "🔊" },
    ],
  },
]

export default function TreeDemo() {
  const [channel, setChannel] = React.useState("general")

  return (
    <div className="w-60 rounded-md bg-newt-bg-surface p-2">
      <Tree
        label="Channels"
        items={CHANNELS}
        defaultExpanded={["text"]}
        value={channel}
        onValueChange={setChannel}
      />
    </div>
  )
}
