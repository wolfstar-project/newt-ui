<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    :class="
      cn(
        'text-[11px] text-newt-text-muted group-hover:text-[color-mix(in_srgb,var(--newt-on-accent)_70%,transparent)]',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
