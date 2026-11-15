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
}>()

const tag = computed(
  () => props.as ?? (props.href === undefined ? "button" : "a")
)
const isButton = computed(() => tag.value === "button")
const decorative = computed(() => tag.value === "span")
</script>

<template>
  <component
    :is="tag"
    :type="isButton ? 'button' : undefined"
    :href="decorative ? undefined : props.href"
    :aria-hidden="decorative ? true : undefined"
    :class="
      cn(
        'mt-3 inline-flex items-center gap-2 rounded-[var(--newt-radius-sm)] border-0 bg-newt-bg-elevated px-4 py-1.5 text-sm font-medium text-newt-text-primary no-underline',
        !decorative &&
          'cursor-pointer transition-colors duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
