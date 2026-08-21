<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-[3px] text-sm text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
