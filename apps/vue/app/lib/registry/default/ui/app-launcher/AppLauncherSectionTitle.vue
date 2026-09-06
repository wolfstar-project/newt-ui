<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <h2
    :class="
      cn(
        'm-0 inline-flex items-center gap-1 text-base font-medium text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </h2>
</template>
