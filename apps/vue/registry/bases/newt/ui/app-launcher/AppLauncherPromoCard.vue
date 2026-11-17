<script setup lang="ts">
import type { HTMLAttributes, VNode } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()

defineSlots<{
  /** The artwork across the top. An `<img>` fills it and is cropped. */
  art?: () => VNode[]
  /** The row below the art, such as an icon, the app name and a line. */
  footer?: () => VNode[]
}>()
</script>

<template>
  <!-- A promoted app: art on top, a footer with its name below. -->
  <button
    type="button"
    :class="
      cn(
        'flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded-[var(--newt-radius-md)] border-0 bg-newt-bg-elevated p-0 text-start text-newt-text-primary transition-colors duration-fast ease-newt',
        'hover:bg-newt-bg-hover',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <span
      v-if="$slots.art"
      class="block aspect-video overflow-hidden bg-newt-bg-base [&>img]:block [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
    >
      <slot name="art" />
    </span>
    <span v-if="$slots.footer" class="flex min-w-0 items-center gap-3 p-3">
      <slot name="footer" />
    </span>
  </button>
</template>
