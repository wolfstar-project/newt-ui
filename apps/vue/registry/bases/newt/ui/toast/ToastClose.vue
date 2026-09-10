<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { TOAST_INJECTION_KEY } from "."

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const ctx = inject(TOAST_INJECTION_KEY, null)
</script>

<template>
  <button
    type="button"
    aria-label="Dismiss"
    :class="
      cn(
        'shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base leading-none text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-primary',
        props.class
      )
    "
    @click="ctx?.close()"
  >
    <slot>&times;</slot>
  </button>
</template>
