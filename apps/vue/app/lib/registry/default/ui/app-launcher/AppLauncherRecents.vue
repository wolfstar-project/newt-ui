<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Horizontal strip of recently used apps. -->
  <div
    :class="
      cn(
        'flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
