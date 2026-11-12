<script setup lang="ts">
import { ref } from "vue"
import { Calendar } from "~~/registry/bases/newt/ui/calendar"

/* `min` and `max` together: only the two weeks of sign-up can be chosen. */
const date = ref("2026-11-12")
</script>

<template>
  <Calendar
    v-model="date"
    aria-label="Sign-up date"
    min="2026-11-09"
    max="2026-11-22"
  />
</template>
