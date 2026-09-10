<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="
      cn(
        'w-5 shrink-0 text-center text-newt-text-muted group-hover:text-white group-data-[active]:text-white',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
