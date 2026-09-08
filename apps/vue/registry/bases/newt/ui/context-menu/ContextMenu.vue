<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="menu"
    :class="
      cn(
        'w-[188px] rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
