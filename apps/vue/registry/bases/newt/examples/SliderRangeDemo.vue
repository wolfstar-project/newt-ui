<script setup lang="ts">
import { ref } from "vue"
import { Slider } from "~~/registry/bases/newt/ui/slider"

const bitrate = ref(64)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <div class="flex items-baseline justify-between text-sm">
      <span class="font-semibold text-newt-text-primary">Bitrate</span>
      <span class="font-mono text-newt-text-muted">{{ bitrate }} kbps</span>
    </div>
    <Slider
      v-model="bitrate"
      aria-label="Bitrate"
      :aria-valuetext="`${bitrate} kilobits per second`"
      :min="8"
      :max="96"
      :step="8"
    />
  </div>
</template>
