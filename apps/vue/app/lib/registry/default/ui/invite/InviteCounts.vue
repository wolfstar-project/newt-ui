<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'mt-0.5 flex items-center gap-3 text-sm text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
