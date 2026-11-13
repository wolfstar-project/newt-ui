<script setup lang="ts">
import { DialogClose } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/* The row for `DrawerTitle`, with the button that closes the drawer at its end. */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Accessible name of the close button. */
    closeLabel?: string
  }>(),
  { closeLabel: "Close" }
)
</script>

<template>
  <header
    :class="
      cn(
        'flex items-center justify-between gap-3 border-b border-newt-border p-4',
        props.class
      )
    "
  >
    <div class="flex min-w-0 flex-col gap-1">
      <slot />
    </div>
    <DialogClose
      :aria-label="props.closeLabel"
      class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-newt-text-muted hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" class="h-4 w-4">
        <path
          fill="currentColor"
          d="M4.3 4.3a1 1 0 0 1 1.4 0L8 6.6l2.3-2.3a1 1 0 1 1 1.4 1.4L9.4 8l2.3 2.3a1 1 0 0 1-1.4 1.4L8 9.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L6.6 8 4.3 5.7a1 1 0 0 1 0-1.4Z"
        />
      </svg>
    </DialogClose>
  </header>
</template>
