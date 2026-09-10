<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'text-xs text-newt-text-muted group-hover:text-white/75 group-data-[active]:text-white/75',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
