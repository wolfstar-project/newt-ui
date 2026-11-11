"use client"

import * as React from "react"

import { ChannelSidebar } from "@/registry/bases/newt/blocks/channel-sidebar/channel-sidebar"
import type { TreeNode } from "@/registry/bases/newt/ui/tree"

/* Placeholder names: no real account, and no Discord asset. */
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
    children: [{ id: "lounge", label: "Lounge", prefix: "🔊" }],
  },
]

export default function ChannelSidebarDemo() {
  const [channel, setChannel] = React.useState("general")

  return (
    <ChannelSidebar
      className="h-[420px] w-64"
      serverName="Build Club"
      channels={CHANNELS}
      defaultExpanded={["text", "voice"]}
      channel={channel}
      onChannelChange={setChannel}
      user={{
        name: "ada",
        initials: "A",
        status: "online",
        statusText: "Online",
      }}
    />
  )
}
