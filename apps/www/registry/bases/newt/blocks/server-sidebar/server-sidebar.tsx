import * as React from "react"

import { Avatar } from "@/registry/bases/newt/ui/avatar"
import {
  MemberList,
  MemberListHeading,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListNameRow,
  MemberListSection,
} from "@/registry/bases/newt/ui/member-list"
import {
  ServerBanner,
  ServerBannerIcon,
  ServerBannerInfo,
  ServerBannerName,
} from "@/registry/bases/newt/ui/server-banner"
import {
  StatusDot,
  StatusIndicator,
} from "@/registry/bases/newt/ui/status-indicator"
import type { StatusDotProps } from "@/registry/bases/newt/ui/status-indicator"
import {
  VoiceChannel,
  VoiceChannelHeader,
  VoiceChannelIcon,
  VoiceChannelMember,
  VoiceChannelMembers,
} from "@/registry/bases/newt/ui/voice-channel"

/*
 * The column beside a channel: who the server is, who is in voice, and who is
 * around. It is an arrangement of registry components, so a project that wants
 * a different order rearranges it rather than restyling anything.
 */
export interface SidebarMember {
  id: string
  name: string
  initials: string
  status: NonNullable<StatusDotProps["status"]>
  /** The section heading this member belongs under. */
  group: string
}

export interface ServerSidebarProps extends React.ComponentProps<"aside"> {
  serverName: string
  /** Who is currently in the voice channel, in join order. */
  voiceChannel?: { name: string; members: readonly string[] }
  members: readonly SidebarMember[]
}

export function ServerSidebar({
  serverName,
  voiceChannel,
  members,
  className,
  ...props
}: ServerSidebarProps) {
  // Grouped here rather than by the caller: the grouping is a property of how
  // this column reads, not of the data.
  const groups = React.useMemo(() => {
    const byGroup = new Map<string, SidebarMember[]>()
    for (const member of members) {
      const existing = byGroup.get(member.group) ?? []
      existing.push(member)
      byGroup.set(member.group, existing)
    }
    return [...byGroup]
  }, [members])

  return (
    <aside
      className={className}
      aria-label={`${serverName} sidebar`}
      {...props}
    >
      <ServerBanner>
        <ServerBannerIcon>{serverName.slice(0, 1)}</ServerBannerIcon>
        <ServerBannerInfo>
          <ServerBannerName>{serverName}</ServerBannerName>
        </ServerBannerInfo>
      </ServerBanner>

      {voiceChannel && (
        <VoiceChannel>
          <VoiceChannelHeader>
            <VoiceChannelIcon />
            {voiceChannel.name}
          </VoiceChannelHeader>
          <VoiceChannelMembers>
            {voiceChannel.members.map((name) => (
              <VoiceChannelMember key={name}>{name}</VoiceChannelMember>
            ))}
          </VoiceChannelMembers>
        </VoiceChannel>
      )}

      <MemberList>
        {groups.map(([group, groupMembers]) => (
          <MemberListSection key={group}>
            <MemberListHeading>
              {group} — {groupMembers.length}
            </MemberListHeading>
            {groupMembers.map((member) => (
              <MemberListItem key={member.id}>
                <StatusIndicator>
                  <Avatar size="sm">{member.initials}</Avatar>
                  <StatusDot status={member.status} />
                </StatusIndicator>
                <MemberListInfo>
                  <MemberListNameRow>
                    <MemberListName>{member.name}</MemberListName>
                  </MemberListNameRow>
                </MemberListInfo>
              </MemberListItem>
            ))}
          </MemberListSection>
        ))}
      </MemberList>
    </aside>
  )
}
