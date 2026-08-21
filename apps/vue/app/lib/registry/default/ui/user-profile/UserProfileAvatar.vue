<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'absolute -top-6 left-4 rounded-full border-4 border-newt-bg-base',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
