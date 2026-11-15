<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /**
   * Lays the rail as a column beside the list, or as a row under it. Without
   * it, the rail is a column, and a row when the picker is narrower than 480px.
   */
  orientation?: "vertical" | "horizontal"
}>()

const railOrientations = {
  vertical: "col-start-1 row-start-1 flex-col overflow-y-auto border-e",
  horizontal:
    "col-span-full row-start-3 flex-row overflow-x-auto overflow-y-hidden border-t",
}

/* The horizontal layout again, for a picker narrower than 480px. */
const railNarrow =
  "[@container_(max-width:480px)]:col-span-full [@container_(max-width:480px)]:row-start-3 [@container_(max-width:480px)]:flex-row [@container_(max-width:480px)]:overflow-x-auto [@container_(max-width:480px)]:overflow-y-hidden [@container_(max-width:480px)]:border-e-0 [@container_(max-width:480px)]:border-t"
</script>

<template>
  <!-- Strip of app icons that filters the list by app. -->
  <nav
    :data-orientation="props.orientation"
    :class="
      cn(
        'flex items-center gap-2 border-newt-border bg-newt-bg-base p-2',
        railOrientations[props.orientation ?? 'vertical'],
        props.orientation === undefined && railNarrow,
        props.class
      )
    "
  >
    <slot />
  </nav>
</template>
