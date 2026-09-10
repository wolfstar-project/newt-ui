<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex min-w-0 flex-1 flex-col gap-2 text-[15px] leading-[1.375] text-newt-text-secondary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
