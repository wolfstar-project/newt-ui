<script setup lang="ts">
import { ref } from "vue"
import { ChannelSidebar } from "~~/registry/bases/newt/blocks/channel-sidebar"
import type { TreeNode } from "~~/registry/bases/newt/ui/tree"

/* Placeholder names: no real account, and no Discord asset. */
const CHANNELS: readonly TreeNode[] = [
  {
    id: "text",
    label: "Text channels",
    children: [
      { id: "general", label: "general", prefix: "#" },
      { id: "help", label: "help", prefix: "#", badge: 3 },
      { id: "release-notes", label: "release-notes", prefix: "#" },
    ],
  },
  {
    id: "voice",
    label: "Voice channels",
    children: [{ id: "lounge", label: "Lounge", prefix: "🔊" }],
  },
]

const channel = ref("general")
</script>

<template>
  <ChannelSidebar
    v-model:channel="channel"
    class="h-[420px] w-64"
    server-name="Build Club"
    :channels="CHANNELS"
    :default-expanded="['text', 'voice']"
    :user="{
      name: 'ada',
      initials: 'A',
      status: 'online',
      statusText: 'Online',
    }"
  />
</template>
