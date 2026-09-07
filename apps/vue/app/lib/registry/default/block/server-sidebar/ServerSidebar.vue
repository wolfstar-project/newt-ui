<script setup lang="ts">
import { computed } from "vue"

import { Avatar } from "@/lib/registry/default/ui/avatar"
import {
  MemberList,
  MemberListHeading,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListNameRow,
  MemberListSection,
} from "@/lib/registry/default/ui/member-list"
import {
  ServerBanner,
  ServerBannerIcon,
  ServerBannerInfo,
  ServerBannerName,
} from "@/lib/registry/default/ui/server-banner"
import {
  StatusDot,
  StatusIndicator,
} from "@/lib/registry/default/ui/status-indicator"
import {
  VoiceChannel,
  VoiceChannelHeader,
  VoiceChannelIcon,
  VoiceChannelMember,
  VoiceChannelMembers,
} from "@/lib/registry/default/ui/voice-channel"

import type { SidebarMember, VoiceChannelSummary } from "./types"

/*
 * The column beside a channel: who the server is, who is in voice, and who is
 * around. It is an arrangement of registry components, so a project that wants
 * a different order rearranges it rather than restyling anything.
 */
const props = defineProps<{
  serverName: string
  voiceChannel?: VoiceChannelSummary
  members: readonly SidebarMember[]
}>()

// Grouped here rather than by the caller: the grouping is a property of how
// this column reads, not of the data.
const groups = computed(() => {
  const byGroup = new Map<string, SidebarMember[]>()
  for (const member of props.members) {
    const existing = byGroup.get(member.group) ?? []
    existing.push(member)
    byGroup.set(member.group, existing)
  }
  return [...byGroup]
})
</script>

<template>
  <aside :aria-label="`${props.serverName} sidebar`">
    <ServerBanner>
      <ServerBannerIcon>{{ props.serverName.slice(0, 1) }}</ServerBannerIcon>
      <ServerBannerInfo>
        <ServerBannerName>{{ props.serverName }}</ServerBannerName>
      </ServerBannerInfo>
    </ServerBanner>

    <VoiceChannel v-if="props.voiceChannel">
      <VoiceChannelHeader>
        <VoiceChannelIcon />
        {{ props.voiceChannel.name }}
      </VoiceChannelHeader>
      <VoiceChannelMembers>
        <VoiceChannelMember
          v-for="name in props.voiceChannel.members"
          :key="name"
        >
          {{ name }}
        </VoiceChannelMember>
      </VoiceChannelMembers>
    </VoiceChannel>

    <MemberList>
      <MemberListSection v-for="[group, groupMembers] in groups" :key="group">
        <MemberListHeading
          >{{ group }} — {{ groupMembers.length }}</MemberListHeading
        >
        <MemberListItem v-for="member in groupMembers" :key="member.id">
          <StatusIndicator>
            <Avatar size="sm">{{ member.initials }}</Avatar>
            <StatusDot :status="member.status" />
          </StatusIndicator>
          <MemberListInfo>
            <MemberListNameRow>
              <MemberListName>{{ member.name }}</MemberListName>
            </MemberListNameRow>
          </MemberListInfo>
        </MemberListItem>
      </MemberListSection>
    </MemberList>
  </aside>
</template>
