<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

import { type ProgressVariants, progressVariants } from "."

const props = withDefaults(
  defineProps<{
    value?: number
    max?: number
    variant?: ProgressVariants["variant"]
    indicatorClass?: HTMLAttributes["class"]
    class?: HTMLAttributes["class"]
  }>(),
  { value: 0, max: 100 }
)

const clamped = computed(() => Math.min(Math.max(props.value, 0), props.max))
const percent = computed(() =>
  props.max > 0 ? (clamped.value / props.max) * 100 : 0
)
</script>

<template>
  <div
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="props.max"
    :aria-valuenow="clamped"
    :class="
      cn('h-2 w-full overflow-hidden rounded-full bg-newt-bg-base', props.class)
    "
  >
    <div
      :class="
        cn(progressVariants({ variant: props.variant }), props.indicatorClass)
      "
      :style="{ width: `${percent}%` }"
    />
  </div>
</template>
