<script setup lang="ts">
import { ref } from "vue"
import { Slider } from "~~/registry/bases/newt/ui/slider"

const LEVELS = [
  { value: 0, label: "Off" },
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
]

/* A mark at every stop turns the track into a short list of named levels. */
const level = ref([2])
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <span class="text-sm font-semibold text-newt-text-primary">
      Noise suppression
    </span>
    <Slider
      v-model="level"
      aria-label="Noise suppression"
      :aria-valuetext="LEVELS[level[0] ?? 0]?.label"
      :min="0"
      :max="3"
      :step="1"
      :marks="LEVELS"
    />
  </div>
</template>
