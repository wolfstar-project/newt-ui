<script setup lang="ts">
import { ref } from "vue"
import { Slider } from "~~/registry/bases/newt/ui/slider"

const MARKS = [
  { value: 0, label: "0%" },
  { value: 100, label: "100%" },
  { value: 200, label: "200%" },
]

const volume = ref(80)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <div class="flex items-baseline justify-between text-sm">
      <span class="font-semibold text-newt-text-primary">Output volume</span>
      <span class="font-mono text-newt-text-muted">{{ volume }}%</span>
    </div>
    <Slider
      v-model="volume"
      aria-label="Output volume"
      :min="0"
      :max="200"
      :marks="MARKS"
    />
  </div>
</template>
