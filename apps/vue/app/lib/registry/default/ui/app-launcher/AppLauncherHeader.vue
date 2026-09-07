<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex h-14 shrink-0 items-center gap-2 px-2 text-base font-semibold',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
