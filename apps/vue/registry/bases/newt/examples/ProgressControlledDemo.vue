<script setup lang="ts">
import { computed, ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import { Progress, ProgressLabel } from "~~/registry/bases/newt/ui/progress"

/*
 * The bar holds no state: it draws the `value` it is given and eases between
 * two of them. Reaching the end is a change of variant, not only of width.
 */
const value = ref(40)
const done = computed(() => value.value >= 100)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <div>
      <ProgressLabel>
        <span>{{ done ? "Upload complete" : "Uploading clip" }}</span>
        <span>{{ value }}%</span>
      </ProgressLabel>
      <Progress
        :value="value"
        :variant="done ? 'success' : 'default'"
        aria-label="Upload"
      />
    </div>
    <div class="flex flex-wrap gap-2">
      <Button
        size="sm"
        :disabled="done"
        @click="value = Math.min(value + 20, 100)"
      >
        Add 20%
      </Button>
      <Button size="sm" variant="secondary" @click="value = 0">
        Start over
      </Button>
    </div>
  </div>
</template>
