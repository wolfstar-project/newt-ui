<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  /**
   * The element or component to render. Defaults to `button`, or to `a`
   * when `href` is set; pass `NuxtLink` or `RouterLink` to keep client
   * navigation. `span` renders the decorative form: hidden from assistive
   * technology, out of the tab order, with no pointer and no hover.
   */
  as?: string | Component
  /** Render a link to this URL. */
  href?: string
  class?: HTMLAttributes["class"]
  /** The unread count drawn beside the arrow. Leave it unset for no badge. */
  badge?: string | number
}>()

const tag = computed(
  () => props.as ?? (props.href === undefined ? "button" : "a")
)
const isButton = computed(() => tag.value === "button")
const decorative = computed(() => tag.value === "span")
</script>

<template>
  <!--
    The control that leaves the channel in the narrow header. It has no text,
    so it needs an `aria-label`; put the unread count in that label too,
    because the label replaces the badge for assistive technology.
  -->
  <component
    :is="tag"
    :type="isButton ? 'button' : undefined"
    :href="decorative ? undefined : props.href"
    :aria-hidden="decorative ? true : undefined"
    :class="
      cn(
        'inline-flex h-6 min-w-6 shrink-0 items-center justify-center gap-1 border-0 bg-transparent p-0 text-newt-text-muted no-underline',
        !decorative &&
          'cursor-pointer transition-colors duration-fast ease-newt hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        class="h-5 w-5 shrink-0 rtl:-scale-x-100"
      >
        <path
          d="M8.7 3.3 2 10l6.7 6.7 1.4-1.4L5.8 11H18V9H5.8l4.3-4.3-1.4-1.4Z"
        />
      </svg>
    </slot>
    <span
      v-if="props.badge !== undefined"
      class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-newt-dnd px-1 text-[11px] font-bold leading-none text-newt-on-accent"
    >
      {{ props.badge }}
    </span>
  </component>
</template>
