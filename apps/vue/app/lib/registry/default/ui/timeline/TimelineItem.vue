<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'relative flex gap-3 pb-5 last:pb-0',
        'before:absolute before:bottom-0 before:left-[11px] before:top-6 before:w-0.5 before:bg-newt-border before:content-[\'\'] last:before:hidden',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
