<script setup lang="ts">
import { Avatar } from "@/lib/registry/default/ui/avatar"
import {
  VoiceChannel,
  VoiceChannelHeader,
  VoiceChannelIcon,
  VoiceChannelMember,
  VoiceChannelMemberIcons,
  VoiceChannelMembers,
} from "@/lib/registry/default/ui/voice-channel"
</script>

<template>
  <VoiceChannel class="w-60">
    <VoiceChannelHeader>
      <VoiceChannelIcon>🔊</VoiceChannelIcon>
      Channel name
    </VoiceChannelHeader>
    <VoiceChannelMembers>
      <VoiceChannelMember>
        <Avatar size="sm">A</Avatar>
        username
        <VoiceChannelMemberIcons>🎙️</VoiceChannelMemberIcons>
      </VoiceChannelMember>
    </VoiceChannelMembers>
  </VoiceChannel>
</template>
