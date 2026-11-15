<script setup lang="ts">
import {
  SelectMenu,
  type SelectMenuOption,
} from "~~/registry/bases/newt/ui/select-menu"

const OPTIONS: SelectMenuOption[] = [
  { value: "news", label: "Announcements", emoji: "📣" },
  { value: "events", label: "Events", emoji: "🎉" },
  { value: "patches", label: "Patch notes", emoji: "🛠️" },
  { value: "games", label: "Game nights", emoji: "🎮" },
]

/*
 * A select under a message sits close to the composer, so it opens upwards.
 * The trigger takes the 40px height through its class hook, and each option
 * carries an emoji in place of an icon.
 */
</script>

<template>
  <SelectMenu
    variant="message"
    side="top"
    trigger-class="min-h-10"
    :options="OPTIONS"
    label="Notification role"
    placeholder="Choose what to hear about"
  />
</template>
