<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'w-[280px] overflow-hidden rounded-[var(--newt-radius-lg)] border border-newt-border bg-newt-bg-base shadow-elevation-high',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
