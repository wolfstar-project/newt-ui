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
        'w-5 shrink-0 text-center text-newt-text-muted group-data-[highlighted]:text-newt-on-accent group-data-[state=checked]:text-newt-on-accent',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
