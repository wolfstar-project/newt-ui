<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'mt-1 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
