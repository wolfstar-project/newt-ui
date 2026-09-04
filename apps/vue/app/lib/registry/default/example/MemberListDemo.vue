<script setup lang="ts">
import { Avatar } from "@/lib/registry/default/ui/avatar"
import {
  MemberList,
  MemberListAppTag,
  MemberListHeading,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListNameRow,
  MemberListRole,
  MemberListSection,
} from "@/lib/registry/default/ui/member-list"
import { RoleTag } from "@/lib/registry/default/ui/role-tag"
import {
  StatusDot,
  StatusIndicator,
} from "@/lib/registry/default/ui/status-indicator"
</script>

<template>
  <MemberList class="w-60">
    <MemberListSection>
      <MemberListHeading>Moderators — 1</MemberListHeading>
      <MemberListItem>
        <StatusIndicator>
          <Avatar size="sm">A</Avatar>
          <StatusDot status="online" />
        </StatusIndicator>
        <MemberListInfo>
          <MemberListNameRow>
            <MemberListName color="#f0b232">username</MemberListName>
            <MemberListAppTag verified />
          </MemberListNameRow>
          <MemberListRole>Role</MemberListRole>
        </MemberListInfo>
        <RoleTag class="ml-auto">TAG</RoleTag>
      </MemberListItem>
    </MemberListSection>
    <MemberListSection offline>
      <MemberListHeading>Offline — 1</MemberListHeading>
      <MemberListItem>
        <StatusIndicator>
          <Avatar size="sm">B</Avatar>
          <StatusDot status="offline" />
        </StatusIndicator>
        <MemberListInfo>
          <MemberListNameRow>
            <MemberListName>someone</MemberListName>
          </MemberListNameRow>
        </MemberListInfo>
      </MemberListItem>
    </MemberListSection>
  </MemberList>
</template>
