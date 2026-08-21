<script setup lang="ts">
import { Avatar } from "@/lib/registry/default/ui/avatar"
import { Button } from "@/lib/registry/default/ui/button"
import { RoleTag } from "@/lib/registry/default/ui/role-tag"
import { StatusIndicator } from "@/lib/registry/default/ui/status-indicator"
import {
  UserProfile,
  UserProfileActions,
  UserProfileAvatar,
  UserProfileBanner,
  UserProfileBio,
  UserProfileBody,
  UserProfileDivider,
  UserProfileHandle,
  UserProfileHead,
  UserProfileName,
  UserProfileRoles,
  UserProfileSectionLabel,
} from "@/lib/registry/default/ui/user-profile"
</script>

<template>
  <UserProfile>
    <UserProfileBanner />
    <UserProfileHead>
      <UserProfileActions>
        <Button variant="icon" aria-label="Send message">✉</Button>
      </UserProfileActions>
      <UserProfileAvatar>
        <StatusIndicator status="online">
          <Avatar size="lg">U</Avatar>
        </StatusIndicator>
      </UserProfileAvatar>
      <UserProfileName>username</UserProfileName>
      <UserProfileHandle>username#0000</UserProfileHandle>
      <UserProfileDivider />
    </UserProfileHead>
    <UserProfileBody>
      <UserProfileSectionLabel>About me</UserProfileSectionLabel>
      <UserProfileBio>Bio text goes here.</UserProfileBio>
      <UserProfileDivider />
      <UserProfileSectionLabel>Roles</UserProfileSectionLabel>
      <UserProfileRoles>
        <RoleTag>Role</RoleTag>
      </UserProfileRoles>
    </UserProfileBody>
  </UserProfile>
</template>
