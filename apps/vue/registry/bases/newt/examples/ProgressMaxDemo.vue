<script setup lang="ts">
import { Progress, ProgressLabel } from "~~/registry/bases/newt/ui/progress"
</script>

<template>
  <!-- `max` keeps the count in its own unit: no percentage to work out by hand. -->
  <div class="w-full max-w-sm">
    <ProgressLabel>
      <span>Server boosts</span>
      <span>3 of 7</span>
    </ProgressLabel>
    <Progress :value="3" :max="7" aria-label="Server boosts" />
  </div>
</template>
