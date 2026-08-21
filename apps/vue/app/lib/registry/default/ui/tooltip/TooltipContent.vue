<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    role="tooltip"
    :class="
      cn(
        'pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#111214] px-2.5 py-1.5 text-xs font-medium text-newt-text-primary opacity-0 shadow-elevation-high transition-opacity duration-fast ease-newt group-hover:opacity-100 group-focus-within:opacity-100',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
