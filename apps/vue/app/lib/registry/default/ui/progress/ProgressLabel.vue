<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'mb-1.5 flex justify-between text-xs text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
