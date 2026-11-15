<script setup lang="ts">
import { SelectMenu } from "~~/registry/bases/newt/ui/select-menu"

/* A role is an option plus what its row shows beside the name. */
const ROLES = [
  { value: "admin", label: "Admin", dot: "bg-newt-dnd", members: 2 },
  { value: "moderator", label: "Moderator", dot: "bg-newt-online", members: 5 },
  { value: "raider", label: "Raider", dot: "bg-newt-idle", members: 24 },
  { value: "guest", label: "Guest", dot: "bg-newt-offline", members: 112 },
]

/*
 * The row is drawn here: a role dot, the name, and a member count at the end.
 * The menu keeps the row itself, its highlight and its tick.
 */
</script>

<template>
  <SelectMenu :options="ROLES" default-value="raider" label="Role">
    <template #item="{ option, index }">
      <span
        aria-hidden="true"
        :class="['h-3 w-3 shrink-0 rounded-full', ROLES[index]?.dot]"
      />
      <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
      <span
        class="shrink-0 text-xs text-newt-text-muted group-data-[highlighted]/item:text-newt-on-accent"
      >
        {{ ROLES[index]?.members }} members
      </span>
    </template>
  </SelectMenu>
</template>
