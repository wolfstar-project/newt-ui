<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  CommandPalette,
  type CommandGroup,
} from "~~/registry/bases/newt/ui/command-palette"

const GROUPS: readonly CommandGroup[] = [
  {
    label: "Channels",
    items: [
      {
        id: "general",
        label: "general",
        prefix: "#",
        description: "Community",
      },
      {
        id: "release-notes",
        label: "release-notes",
        prefix: "#",
        description: "Announcements",
      },
      { id: "help", label: "help", prefix: "#", description: "Support" },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        id: "settings",
        label: "Server settings",
        prefix: "⚙",
        shortcut: "Ctrl ,",
        keywords: ["preferences", "config"],
      },
      { id: "mention", label: "Mention a member", prefix: "@" },
    ],
  },
]

const open = ref(false)
const last = ref("Nothing chosen yet")
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <Button variant="secondary" @click="open = true">
      Open quick switcher
    </Button>
    <p class="m-0 text-xs text-newt-text-muted" aria-live="polite">
      {{ last }}
    </p>
    <CommandPalette
      v-model:open="open"
      label="Quick switcher"
      :groups="GROUPS"
      @select="last = `Went to ${$event.label}`"
    />
  </div>
</template>
