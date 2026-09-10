<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <p
    :class="
      cn(
        'font-display text-xl font-bold leading-tight text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </p>
</template>
