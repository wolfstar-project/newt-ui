<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-lg border border-newt-border bg-newt-bg-elevated p-5 text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
