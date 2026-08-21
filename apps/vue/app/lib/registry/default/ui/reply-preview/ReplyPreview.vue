<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'relative mb-1 flex items-center gap-1.5 pl-[18px] text-[13px] text-newt-text-muted',
        'before:absolute before:left-0 before:top-1/2 before:h-3 before:w-3 before:-translate-y-full before:rounded-tl-[6px] before:border-l-2 before:border-t-2 before:border-newt-border before:content-[\'\']',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
