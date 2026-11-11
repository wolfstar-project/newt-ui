<script setup lang="ts">
import { useId, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** The small heading over the group. Omit it for an unlabelled group. */
  label?: string
}>()

const id = useId()
</script>

<template>
  <div
    :class="
      cn('border-newt-border py-2 [&:not(:first-child)]:border-t', props.class)
    "
  >
    <div
      v-if="props.label !== undefined"
      :id="id"
      class="px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted"
    >
      {{ props.label }}
    </div>
    <ul
      :aria-labelledby="props.label === undefined ? undefined : id"
      class="m-0 flex list-none flex-col gap-0.5 p-0"
    >
      <slot />
    </ul>
  </div>
</template>
