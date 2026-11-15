<script setup lang="ts">
import { SlashCommand } from "~~/registry/bases/newt/ui/slash-command"

const banOptions = [
  { name: "user", value: "@username" },
  { name: "reason", description: "why they were banned", focused: true },
]
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <SlashCommand name="command" />
    <SlashCommand name="ban" subcommand="member" :options="banOptions" />
    <SlashCommand
      name="conf"
      subcommand-group="menu"
      subcommand="save"
      :options="[{ name: 'key', value: 'prefix' }]"
    />
    <SlashCommand name="remind" :options="[{ name: 'in', value: '10m' }]">
      <span class="text-newt-text-muted">sends in this channel</span>
    </SlashCommand>
  </div>
</template>
