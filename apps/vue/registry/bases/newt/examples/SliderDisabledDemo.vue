<script setup lang="ts">
import { Slider } from "~~/registry/bases/newt/ui/slider"

const MARKS = [
  { value: 0, label: "0%" },
  { value: 100, label: "100%" },
]
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <div class="flex items-baseline justify-between text-sm">
      <span class="font-semibold text-newt-text-primary">Input volume</span>
      <span class="text-newt-text-muted">No microphone found</span>
    </div>
    <Slider
      aria-label="Input volume"
      :model-value="40"
      :marks="MARKS"
      disabled
    />
  </div>
</template>
