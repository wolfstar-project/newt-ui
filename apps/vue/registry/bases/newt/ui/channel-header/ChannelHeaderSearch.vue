<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
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
    /** The text shown when the default slot is empty. */
    placeholder?: string
    /**
     * Icon-only form for the narrow header. The text stays in the control for
     * assistive technology, so it is still the accessible name.
     */
    compact?: boolean
  }>(),
  { placeholder: "Search", compact: false }
)

const tag = computed(
  () => props.as ?? (props.href === undefined ? "button" : "a")
)
const isButton = computed(() => tag.value === "button")
const decorative = computed(() => tag.value === "span")
</script>

<template>
  <!-- Its text is its accessible name: what a user sees is what they can say. -->
  <component
    :is="tag"
    :type="isButton ? 'button' : undefined"
    :href="decorative ? undefined : props.href"
    :aria-hidden="decorative ? true : undefined"
    :class="
      cn(
        'flex shrink-0 items-center text-newt-text-muted no-underline',
        props.compact
          ? 'h-6 w-6 justify-center border-0 bg-transparent p-0'
          : 'h-7 w-60 justify-between gap-3 rounded-sm border border-newt-border bg-newt-bg-input px-2',
        !decorative &&
          'cursor-pointer transition-colors duration-fast ease-newt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        !decorative &&
          (props.compact
            ? 'hover:text-newt-text-primary'
            : 'hover:border-newt-text-muted'),
        props.class
      )
    "
  >
    <span
      :class="
        props.compact
          ? 'sr-only'
          : 'min-w-0 flex-1 truncate text-start text-sm font-medium leading-none'
      "
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
      :class="cn('shrink-0', props.compact ? 'h-5 w-5' : 'h-4 w-4')"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  </component>
</template>
