<script setup lang="ts">
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import { NotifBadge } from "~~/registry/bases/newt/ui/notif-badge"
</script>

<template>
  <div class="flex items-center gap-8">
    <div class="relative inline-block">
      <Avatar>U</Avatar>
      <NotifBadge class="absolute -right-1 -top-1">3</NotifBadge>
    </div>

    <NotifBadge variant="unread" aria-label="Unread" />
  </div>
</template>
