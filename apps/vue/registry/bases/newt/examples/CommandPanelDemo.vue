<script setup lang="ts">
import { CommandPanel } from "~~/registry/bases/newt/blocks/command-panel"
import type { CommandPanelCommand } from "~~/registry/bases/newt/blocks/command-panel"

const COMMANDS: readonly CommandPanelCommand[] = [
  {
    id: "poll",
    name: "poll create",
    description: "Create a poll for the current channel.",
    appLabel: "Community",
    options: [
      {
        name: "question",
        type: "STRING",
        required: true,
        description: "The question people will answer.",
      },
      {
        name: "duration",
        type: "INTEGER",
        description: "How many hours the poll stays open.",
      },
    ],
  },
  {
    id: "remind",
    name: "remind",
    description: "Schedule a reminder in this channel.",
    appLabel: "Utilities",
    options: [
      { name: "when", type: "STRING", required: true },
      { name: "message", type: "STRING", required: true },
    ],
  },
  {
    id: "topic",
    name: "topic suggest",
    description: "Suggest a conversation prompt.",
    appLabel: "Community",
  },
]
</script>

<template>
  <CommandPanel :commands="COMMANDS" default-selected-id="poll" />
</template>
