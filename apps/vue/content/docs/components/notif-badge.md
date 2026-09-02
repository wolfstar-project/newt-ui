---
title: Notification Badge
description: A small count badge or unread dot for signalling new activity on avatars and channels.
---

<ComponentPreview name="NotifBadgeDemo" />

## Installation

```bash
npx @newtui/vue@latest add notif-badge
```

## Usage

```vue
<script setup lang="ts">
import { Avatar } from "@/components/ui/avatar"
import { NotifBadge } from "@/components/ui/notif-badge"
</script>

<template>
  <div class="relative inline-block">
    <Avatar>U</Avatar>
    <NotifBadge class="absolute -right-1 -top-1">3</NotifBadge>
  </div>

  <NotifBadge variant="mention">@</NotifBadge>

  <NotifBadge variant="unread" aria-label="Unread" />
</template>
```
