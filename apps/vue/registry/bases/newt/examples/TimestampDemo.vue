<script setup lang="ts">
import { Timestamp } from "~~/registry/bases/newt/ui/timestamp"

/* Fixed rather than `Date.now()`, so the demo renders the same every time. */
const raid = new Date("2026-09-12T20:00:00Z")
</script>

<template>
  <div class="flex flex-col gap-2 text-sm text-newt-text-secondary">
    <p>The raid starts <Timestamp :value="raid" format="relative" />.</p>
    <p>
      Doors open at <Timestamp :value="raid" format="shortTime" /> on
      <Timestamp :value="raid" format="longDate" />.
    </p>
  </div>
</template>
