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
  /**
   * Turns the control off. A link loses its URL, which takes it out of the
   * tab order, and says so with `aria-disabled`.
   */
  disabled?: boolean
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
    :href="decorative || props.disabled ? undefined : props.href"
    :disabled="isButton ? props.disabled : undefined"
    :aria-disabled="
      !isButton && !decorative && props.disabled ? true : undefined
    "
    :aria-hidden="decorative ? true : undefined"
    :class="
      cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-newt-text-secondary no-underline',
        !decorative &&
          'cursor-pointer transition-colors aria-disabled:pointer-events-none duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
