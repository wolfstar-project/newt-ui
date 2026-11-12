<script setup lang="ts">
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "~~/registry/bases/newt/ui/status-indicator"

/* The fifth state: a member who is live, which outranks plain "online". */
</script>

<template>
  <div class="flex items-center gap-3">
    <StatusIndicator aria-label="Streaming">
      <Avatar>R</Avatar>
      <StatusDot status="streaming" />
    </StatusIndicator>
    <div class="flex flex-col text-start">
      <span class="text-sm font-semibold text-newt-text-primary">rowan</span>
      <span class="text-xs text-newt-text-muted">
        Live · Speedrun practice
      </span>
    </div>
  </div>
</template>
