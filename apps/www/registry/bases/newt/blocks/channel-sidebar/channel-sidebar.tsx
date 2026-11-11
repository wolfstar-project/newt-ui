"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/bases/newt/ui/status-indicator"
import type { StatusDotProps } from "@/registry/bases/newt/ui/status-indicator"
import { Tree, type TreeNode } from "@/registry/bases/newt/ui/tree"
import {
  UserPanel,
  UserPanelActions,
  UserPanelButton,
  UserPanelInfo,
} from "@/registry/bases/newt/ui/user-panel"

/*
 * The shape the sidebar reads. A block does not know your data layer; map
 * onto this at the edge of it.
 */
export interface SidebarUser {
  name: string
  initials: string
  status: NonNullable<StatusDotProps["status"]>
  /** The line under the name. */
  statusText?: string
}

export interface ChannelSidebarProps extends Omit<
  React.ComponentProps<"aside">,
  "onChange"
> {
  serverName: string
  /** Categories and their channels, as the tree takes them. */
  channels: readonly TreeNode[]
  /** Ids of the categories that start open. */
  defaultExpanded?: readonly string[]
  /** The id of the channel being shown. */
  channel?: string
  onChannelChange?: (channel: string) => void
  user: SidebarUser
  /** Called when the settings button in the user panel is pressed. */
  onOpenSettings?: () => void
}

/*
 * The column a server is navigated from: its name, its channels as a tree and
 * the signed-in user's controls pinned to the foot. Muting and deafening are
 * kept here as local state because the block has no voice connection to tell;
 * lift them when yours does.
 */
export function ChannelSidebar({
  serverName,
  channels,
  defaultExpanded,
  channel,
  onChannelChange,
  user,
  onOpenSettings,
  className,
  ...props
}: ChannelSidebarProps) {
  const [muted, setMuted] = React.useState(false)
  const [deafened, setDeafened] = React.useState(false)

  return (
    <aside
      aria-label={`${serverName} channels`}
      className={cn(
        "flex h-full min-h-0 flex-col bg-newt-bg-surface",
        className
      )}
      {...props}
    >
      <header className="border-b border-newt-border px-4 py-3 text-[15px] font-semibold leading-5 text-newt-text-primary">
        <span className="block truncate">{serverName}</span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <Tree
          label="Channels"
          items={channels}
          defaultExpanded={defaultExpanded}
          value={channel}
          onValueChange={onChannelChange}
        />
      </div>
      <div className="p-2">
        <UserPanel>
          <StatusIndicator>
            <Avatar size="sm">{user.initials}</Avatar>
            <StatusDot status={user.status} />
          </StatusIndicator>
          <UserPanelInfo name={user.name} status={user.statusText} />
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
            <UserPanelButton
              icon="settings"
              label="User settings"
              onClick={onOpenSettings}
            />
          </UserPanelActions>
        </UserPanel>
      </div>
    </aside>
  )
}
