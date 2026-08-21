---
title: Member List Row
description: A hoverable row showing a member's avatar, presence, name and role.
---

<ComponentPreview name="MemberListDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add member-list
```

## Usage

```vue
<script setup lang="ts">
import {
  MemberList,
  MemberListInfo,
  MemberListItem,
  MemberListName,
  MemberListRole,
} from "@/components/ui/member-list"
</script>

<template>
  <MemberList>
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
```

Pass `colored` to `MemberListName` to render it in the brand colour.
