<script setup lang="ts">
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import {
  StatusDot,
  StatusIndicator,
} from "~~/registry/bases/newt/ui/status-indicator"
</script>

<template>
  <div class="flex items-center gap-6">
    <StatusIndicator>
      <Avatar>A</Avatar>
      <StatusDot status="online" label="Online" />
    </StatusIndicator>
    <StatusIndicator>
      <Avatar>B</Avatar>
      <StatusDot status="idle" label="Idle" />
    </StatusIndicator>
    <StatusIndicator>
      <Avatar>C</Avatar>
      <StatusDot status="dnd" label="Do not disturb" />
    </StatusIndicator>
    <StatusIndicator>
      <Avatar>D</Avatar>
      <StatusDot status="offline" label="Offline" />
    </StatusIndicator>
  </div>
</template>
