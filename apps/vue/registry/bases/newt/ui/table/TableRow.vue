<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Marks the row as chosen, for a table whose rows can be picked. */
    selected?: boolean
  }>(),
  { selected: undefined }
)
</script>

<template>
  <tr
    :aria-selected="props.selected"
    :class="
      cn(
        'aria-selected:bg-newt-bg-active aria-selected:text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </tr>
</template>
