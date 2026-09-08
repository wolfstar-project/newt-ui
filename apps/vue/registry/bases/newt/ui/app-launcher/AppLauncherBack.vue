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
        'inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-newt-bg-elevated p-0 text-newt-text-secondary transition-colors duration-fast ease-newt',
        'hover:bg-newt-bg-hover hover:text-newt-text-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
