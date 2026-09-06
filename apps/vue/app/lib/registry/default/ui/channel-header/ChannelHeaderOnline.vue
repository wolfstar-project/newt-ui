<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Compact "N Online" readout used by the narrow layout of the header. -->
  <span
    :class="
      cn(
        'inline-flex items-center gap-1.5 text-xs text-newt-text-muted',
        props.class
      )
    "
  >
    <span
      aria-hidden="true"
      class="h-2 w-2 shrink-0 rounded-full bg-newt-online"
    />
    <slot />
  </span>
</template>
