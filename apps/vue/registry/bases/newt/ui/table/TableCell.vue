<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** `end` aligns the cell to the inline end and sets tabular figures. */
    align?: "start" | "end"
  }>(),
  { align: "start" }
)
</script>

<template>
  <td
    :class="
      cn(
        'whitespace-nowrap px-4 py-2.5',
        props.align === 'end' ? 'text-end tabular-nums' : 'text-start',
        props.class
      )
    "
  >
    <slot />
  </td>
</template>
