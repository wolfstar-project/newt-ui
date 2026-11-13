<script setup lang="ts">
import {
  AccordionHeader,
  AccordionTrigger,
  useForwardProps,
  type AccordionTriggerProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The always-visible line that opens the section. It is a button inside a
 * heading, so a screen reader lists the sections among the page's headings.
 */
const props = defineProps<
  AccordionTriggerProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <AccordionHeader class="m-0 flex">
    <AccordionTrigger
      v-bind="forwarded"
      :class="
        cn(
          'group flex flex-1 cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-start text-[15px] font-semibold leading-5 text-newt-text-primary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover',
          'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link',
          'disabled:pointer-events-none disabled:opacity-50',
          props.class
        )
      "
    >
      <slot />
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-newt-text-muted group-data-[state=open]:rotate-90 rtl:-scale-x-100 rtl:group-data-[state=open]:scale-x-100"
      >
        <path
          fill="currentColor"
          d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
        />
      </svg>
    </AccordionTrigger>
  </AccordionHeader>
</template>
