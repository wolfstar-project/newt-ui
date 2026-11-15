<script setup lang="ts">
import { ref } from "vue"
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import {
  MemberList,
  MemberListHeading,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListNameRow,
  MemberListRole,
  MemberListSection,
} from "~~/registry/bases/newt/ui/member-list"
import {
  StatusDot,
  StatusIndicator,
} from "~~/registry/bases/newt/ui/status-indicator"

/*
 * Rows that open a profile are buttons: Tab reaches each one, and Enter or
 * Space opens it. The first row carries a decoration under its hover.
 */
const members = [
  { name: "juniper", status: "online", label: "Online", role: "Gardener" },
  { name: "sorrel", status: "idle", label: "Idle", role: "Archivist" },
  { name: "thistle", status: "dnd", label: "Do not disturb", role: "Builder" },
] as const

const opened = ref<string>()
</script>

<template>
  <div class="flex w-60 flex-col gap-2">
    <MemberListSection>
      <MemberListHeading as="h4">Online — 3</MemberListHeading>
      <MemberList>
        <MemberListItem
          v-for="(member, index) in members"
          :key="member.name"
          interactive
          @click="opened = member.name"
        >
          <template v-if="index === 0" #decoration>
            <span
              class="block h-full w-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--newt-brand)_45%,transparent),transparent)]"
            />
          </template>
          <StatusIndicator>
            <Avatar size="md">{{ member.name.charAt(0).toUpperCase() }}</Avatar>
            <StatusDot :status="member.status" :label="member.label" />
          </StatusIndicator>
          <MemberListInfo>
            <MemberListNameRow>
              <MemberListName>{{ member.name }}</MemberListName>
            </MemberListNameRow>
            <MemberListRole>{{ member.role }}</MemberListRole>
          </MemberListInfo>
        </MemberListItem>
      </MemberList>
    </MemberListSection>
    <p class="m-0 px-2 text-xs text-newt-text-muted" aria-live="polite">
      {{ opened === undefined ? "No profile open" : `Profile: ${opened}` }}
    </p>
  </div>
</template>
