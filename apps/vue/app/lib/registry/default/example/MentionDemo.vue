<script setup lang="ts">
import { Mention } from "@/lib/registry/default/ui/mention"

/* Inline so the demo never reaches out to the network for a placeholder. */
const AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%235865f2'/%3E%3C/svg%3E"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Mention variant="user">@username</Mention>
    <Mention variant="channel">#channel</Mention>
    <Mention variant="role" color="#f0b232">@Moderator</Mention>
    <Mention variant="user" :avatar="AVATAR">@with-avatar</Mention>
  </div>
</template>
