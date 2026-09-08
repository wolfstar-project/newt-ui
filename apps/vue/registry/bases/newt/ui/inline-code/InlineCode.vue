<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- `pre-wrap` keeps wrapped code readable without eating the spacing. -->
  <code
    :class="
      cn(
        'whitespace-pre-wrap rounded-sm border border-newt-border bg-newt-bg-base px-1 font-mono text-[0.85em] text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </code>
</template>
