<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="menu"
    :class="
      cn(
        'w-60 rounded-md border border-newt-border bg-[var(--newt-bg-floating)] p-1.5 text-newt-text-primary shadow-elevation-high',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
