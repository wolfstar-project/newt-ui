<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!--
    Title of a drill-in view. It takes the free width and centres in it, so
    put a spacer as wide as the back control after it to centre it in the
    header.
  -->
  <h2
    :class="
      cn(
        'm-0 min-w-0 flex-1 truncate text-center text-base font-semibold text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </h2>
</template>
