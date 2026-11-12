<script setup lang="ts">
import { Badge } from "~~/registry/bases/newt/ui/badge"

const CHANNELS = [
  { name: "announcements", count: 1, variant: "brand" },
  { name: "general", count: 12, variant: "danger" },
  { name: "off-topic", count: 3, variant: "default" },
] as const
</script>

<template>
  <!-- A bare number means nothing to a screen reader, so each count says what it counts. -->
  <div class="flex w-full max-w-xs flex-col gap-1">
    <div
      v-for="channel in CHANNELS"
      :key="channel.name"
      class="flex items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm text-newt-text-secondary"
    >
      <span class="truncate"># {{ channel.name }}</span>
      <Badge :variant="channel.variant">
        {{ channel.count }}<span class="sr-only"> unread</span>
      </Badge>
    </div>
  </div>
</template>
