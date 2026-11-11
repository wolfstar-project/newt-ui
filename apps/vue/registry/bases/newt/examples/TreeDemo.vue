<script setup lang="ts">
import { ref } from "vue"
import { Tree, type TreeNode } from "~~/registry/bases/newt/ui/tree"

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
    children: [
      { id: "lounge", label: "Lounge", prefix: "🔊" },
      { id: "stage", label: "Town hall", prefix: "🔊" },
    ],
  },
]

const channel = ref("general")
</script>

<template>
  <div class="w-60 rounded-md bg-newt-bg-surface p-2">
    <Tree
      v-model="channel"
      label="Channels"
      :items="CHANNELS"
      :default-expanded="['text']"
    />
  </div>
</template>
