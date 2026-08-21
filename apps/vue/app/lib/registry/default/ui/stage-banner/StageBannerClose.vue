<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { STAGE_BANNER_INJECTION_KEY } from "."

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const ctx = inject(STAGE_BANNER_INJECTION_KEY, null)
</script>

<template>
  <button
    type="button"
    aria-label="Dismiss"
    :class="
      cn(
        'ml-auto shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base leading-none text-white/80 transition-colors duration-fast ease-newt hover:text-white group-data-[variant=neutral]:text-newt-text-muted group-data-[variant=neutral]:hover:text-newt-text-primary',
        props.class
      )
    "
    @click="ctx?.close()"
  >
    <slot>&times;</slot>
  </button>
</template>
