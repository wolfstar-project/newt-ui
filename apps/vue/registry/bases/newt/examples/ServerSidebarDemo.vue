<script setup lang="ts">
import { ServerSidebar } from "~~/registry/bases/newt/blocks/server-sidebar"
import type { SidebarMember } from "~~/registry/bases/newt/blocks/server-sidebar"

/* Placeholder names: no real account, and no Discord asset. */
const MEMBERS: SidebarMember[] = [
  {
    id: "1",
    name: "alex",
    initials: "A",
    status: "online",
    group: "Moderators",
  },
  { id: "2", name: "sam", initials: "S", status: "idle", group: "Online" },
  { id: "3", name: "robin", initials: "R", status: "dnd", group: "Online" },
  { id: "4", name: "kit", initials: "K", status: "offline", group: "Offline" },
]
</script>

<template>
  <ServerSidebar
    class="w-64"
    server-name="Build Club"
    :voice-channel="{ name: 'General voice', members: ['alex', 'sam'] }"
    :members="MEMBERS"
  />
</template>
