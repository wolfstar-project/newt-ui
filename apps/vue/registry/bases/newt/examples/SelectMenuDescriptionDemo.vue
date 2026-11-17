<script setup lang="ts">
import {
  SelectMenu,
  type SelectMenuOption,
} from "~~/registry/bases/newt/ui/select-menu"

const OPTIONS: SelectMenuOption[] = [
  { value: "announcements", label: "announcements", description: "Community" },
  { value: "patch-notes", label: "patch-notes", description: "Community" },
  { value: "raid-planning", label: "raid-planning", description: "Guild" },
  { value: "loot-council", label: "loot-council", description: "Guild" },
]

/* The description names the category, so it leads with a folder glyph. */
</script>

<template>
  <SelectMenu :options="OPTIONS" label="Channel" placeholder="Choose a channel">
    <template #item-description="{ option }">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        class="me-1 inline h-3 w-3 align-[-1px]"
      >
        <path
          fill="currentColor"
          d="M3 6a2 2 0 0 1 2-2h4.2a2 2 0 0 1 1.4.6L12 6h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"
        /></svg
      >{{ option.description }}
    </template>
  </SelectMenu>
</template>
