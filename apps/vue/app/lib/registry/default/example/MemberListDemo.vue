<script setup lang="ts">
import { Avatar } from "@/lib/registry/default/ui/avatar"
import {
  MemberList,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListRole,
} from "@/lib/registry/default/ui/member-list"
import { RoleTag } from "@/lib/registry/default/ui/role-tag"
import { StatusIndicator } from "@/lib/registry/default/ui/status-indicator"
</script>

<template>
  <MemberList class="w-60">
    <MemberListItem>
      <StatusIndicator status="online">
        <Avatar size="sm">A</Avatar>
      </StatusIndicator>
      <MemberListInfo>
        <MemberListName>username</MemberListName>
        <MemberListRole>Role</MemberListRole>
      </MemberListInfo>
      <RoleTag class="ml-auto">TAG</RoleTag>
    </MemberListItem>
  </MemberList>
</template>
