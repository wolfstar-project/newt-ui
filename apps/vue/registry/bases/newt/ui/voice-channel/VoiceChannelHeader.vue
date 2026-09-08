<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex cursor-pointer items-center gap-1.5 text-[15px] font-medium text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-secondary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
