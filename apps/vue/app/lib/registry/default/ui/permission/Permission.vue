<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center justify-between border-b border-newt-border py-2.5 last:border-b-0',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
