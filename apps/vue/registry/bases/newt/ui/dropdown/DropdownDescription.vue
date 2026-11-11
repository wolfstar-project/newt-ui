<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'text-xs text-newt-text-muted group-hover:text-[color-mix(in_srgb,var(--newt-on-accent)_75%,transparent)] group-data-[active]:text-[color-mix(in_srgb,var(--newt-on-accent)_75%,transparent)]',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
