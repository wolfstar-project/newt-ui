<script setup lang="ts">
import { ref } from "vue"
import { Slider } from "~~/registry/bases/newt/ui/slider"

const members = ref([100, 500])
</script>

<template>
  <!--
    Two values give two grabbers. The name goes on the group around them, and
    each grabber keeps its own "Minimum" or "Maximum".
  -->
  <div class="flex w-full max-w-sm flex-col gap-3">
    <div class="flex items-baseline justify-between text-sm">
      <span class="font-semibold text-newt-text-primary">Server size</span>
      <span class="font-mono text-newt-text-muted">
        {{ members[0] }} to {{ members[1] }} members
      </span>
    </div>
    <Slider
      v-model="members"
      aria-label="Server size"
      :min="0"
      :max="1000"
      :step="50"
      :min-steps-between-thumbs="1"
    />
  </div>
</template>
