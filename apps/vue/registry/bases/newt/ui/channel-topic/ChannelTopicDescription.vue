<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    :class="
      cn(
        'overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
