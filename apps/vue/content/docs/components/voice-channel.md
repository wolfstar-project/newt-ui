---
title: Voice Channel Row
description: A sidebar voice channel row with a collapsible header and the list of connected members.
---

<ComponentPreview name="VoiceChannelDemo" />

## Installation

```bash
npx newt-ui-vue@latest add voice-channel
```

## Usage

```vue
<script setup lang="ts">
import { Avatar } from "@/components/ui/avatar"
import {
  VoiceChannel,
  VoiceChannelHeader,
  VoiceChannelIcon,
  VoiceChannelMember,
  VoiceChannelMemberIcons,
  VoiceChannelMembers,
} from "@/components/ui/voice-channel"
</script>

<template>
  <VoiceChannel>
    <VoiceChannelHeader>
      <VoiceChannelIcon>🔊</VoiceChannelIcon>
      General
    </VoiceChannelHeader>
    <VoiceChannelMembers>
      <VoiceChannelMember>
        <Avatar size="sm">A</Avatar>
        username
        <VoiceChannelMemberIcons>🎙️</VoiceChannelMemberIcons>
      </VoiceChannelMember>
      <VoiceChannelMember>
        <Avatar size="sm">B</Avatar>
        muted-user
        <VoiceChannelMemberIcons muted>🔇</VoiceChannelMemberIcons>
      </VoiceChannelMember>
    </VoiceChannelMembers>
  </VoiceChannel>
</template>
```

Pass `muted` to `VoiceChannelMemberIcons` to render the icons in the dnd color.
