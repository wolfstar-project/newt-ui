<script setup lang="ts">
import { ref } from "vue"
import { Calendar } from "~~/registry/bases/newt/ui/calendar"

const date = ref("2026-11-14")
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <Calendar v-model="date" aria-label="Event date" min="2026-11-03" />
    <p class="m-0 text-xs text-newt-text-muted" aria-live="polite">
      Event on <span class="font-mono">{{ date }}</span>
    </p>
  </div>
</template>
