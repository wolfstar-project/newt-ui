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
        'inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-0 bg-newt-bg-base p-0 text-newt-text-secondary transition-[filter] duration-fast ease-newt',
        'hover:brightness-110',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        '[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-6 [&>svg]:w-6',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
