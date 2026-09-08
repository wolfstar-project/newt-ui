<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes["class"]; placeholder?: string }>(),
  { placeholder: "Search" }
)
</script>

<template>
  <button
    type="button"
    :aria-label="props.placeholder"
    :class="
      cn(
        'flex h-7 w-60 shrink-0 cursor-pointer items-center justify-between gap-3 rounded-sm border border-newt-border bg-newt-bg-input px-2 text-newt-text-muted transition-colors duration-fast ease-newt',
        'hover:border-newt-text-muted',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <span
      class="min-w-0 flex-1 truncate text-start text-sm font-medium leading-none"
    >
      <slot>{{ props.placeholder }}</slot>
    </span>
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      aria-hidden="true"
      class="h-4 w-4 shrink-0"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  </button>
</template>
