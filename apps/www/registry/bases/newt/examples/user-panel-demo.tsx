"use client"

import * as React from "react"

import { Avatar } from "@/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/bases/newt/ui/status-indicator"
import {
  UserPanel,
  UserPanelActions,
  UserPanelButton,
  UserPanelInfo,
} from "@/registry/bases/newt/ui/user-panel"

export default function UserPanelDemo() {
  const [muted, setMuted] = React.useState(true)
  const [deafened, setDeafened] = React.useState(false)

  return (
    <UserPanel className="w-60">
      <StatusIndicator>
        <Avatar size="sm">A</Avatar>
        <StatusDot status="online" />
      </StatusIndicator>
      <UserPanelInfo name="ada" status={muted ? "Muted" : "Online"} />
      <UserPanelActions>
        <UserPanelButton
          icon="microphone"
          label="Mute"
          pressed={muted}
          onPressedChange={setMuted}
        />
        <UserPanelButton
          icon="headphones"
          label="Deafen"
          pressed={deafened}
          onPressedChange={setDeafened}
        />
        <UserPanelButton icon="settings" label="User settings" />
      </UserPanelActions>
    </UserPanel>
  )
}
