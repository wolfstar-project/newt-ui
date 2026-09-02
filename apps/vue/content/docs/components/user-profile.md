---
title: User Profile Popout
description: Floating profile card with a banner, overlapping avatar, bio section and role tags.
---

<ComponentPreview name="UserProfileDemo" />

## Installation

```bash
npx @newtui/vue@latest add user-profile
```

## Usage

```vue
<script setup lang="ts">
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
} from "@/components/ui/user-profile"
import { Avatar } from "@/components/ui/avatar"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { RoleTag } from "@/components/ui/role-tag"
import { Button } from "@/components/ui/button"
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
```

`UserProfileBanner` accepts a `class` or `style` to override the default brand color with a custom banner image or gradient.
