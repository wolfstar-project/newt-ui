<script setup lang="ts">
import { SlashCommand } from "@/lib/registry/default/ui/slash-command"

const banOptions = [
  { name: "user", value: "@username" },
  { name: "reason", description: "why they were banned", focused: true },
]
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <SlashCommand name="command" />
    <SlashCommand name="ban" subcommand="member" :options="banOptions" />
  </div>
</template>
