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
        'mt-3 inline-flex cursor-pointer items-center gap-2 rounded-sm border-0 bg-newt-bg-elevated px-4 py-1.5 text-sm font-medium text-newt-text-primary transition-colors duration-fast ease-newt',
        'hover:bg-newt-bg-hover',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
