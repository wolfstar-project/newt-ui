<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { accordionKey } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** The always-visible line that opens the section. A `title` slot overrides it. */
    title?: string
    /** Start open. The reader, not the application, owns it from there. */
    defaultOpen?: boolean
  }>(),
  { defaultOpen: false }
)

const name = inject(accordionKey, undefined)
</script>

<template>
  <details
    :name="name"
    :open="props.defaultOpen ? true : undefined"
    :class="
      cn('group border-newt-border [&:not(:first-child)]:border-t', props.class)
    "
  >
    <summary
      class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-semibold leading-5 text-newt-text-primary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link [&::-webkit-details-marker]:hidden"
    >
      <slot name="title">{{ props.title }}</slot>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-newt-text-muted group-open:rotate-90 rtl:-scale-x-100 rtl:group-open:scale-x-100"
      >
        <path
          fill="currentColor"
          d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
        />
      </svg>
    </summary>
    <div class="px-4 pb-3.5 text-sm leading-5 text-newt-text-secondary">
      <slot />
    </div>
  </details>
</template>
