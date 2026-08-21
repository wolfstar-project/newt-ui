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
        'ml-auto shrink-0 cursor-pointer rounded-sm border-0 bg-black/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors duration-fast ease-newt hover:bg-black/[0.32]',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
