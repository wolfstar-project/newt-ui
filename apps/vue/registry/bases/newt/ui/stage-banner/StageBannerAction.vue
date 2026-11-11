<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'ms-auto shrink-0 cursor-pointer rounded-sm border-0 bg-[color-mix(in_srgb,var(--newt-overlay)_33%,transparent)] px-2.5 py-1 text-xs font-semibold text-newt-on-accent transition-colors duration-fast ease-newt hover:bg-[color-mix(in_srgb,var(--newt-overlay)_53%,transparent)]',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
