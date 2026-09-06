<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'cursor-pointer rounded-sm border-0 bg-transparent p-0 text-base font-semibold text-newt-text-link no-underline hover:underline',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
