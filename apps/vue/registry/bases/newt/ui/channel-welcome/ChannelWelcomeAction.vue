<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

defineOptions({ inheritAttrs: false })

/*
 * The `span` form runs nothing: it drops every listener, so a click cannot
 * start an action that the keyboard and assistive technology miss.
 */
function withoutListeners(attrs: HTMLAttributes): HTMLAttributes {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !/^on[A-Z]/.test(name))
  )
}

const props = defineProps<{
  /**
   * The element or component to render. Defaults to `button`, or to `a`
   * when `href` is set; pass `NuxtLink` or `RouterLink` to keep client
   * navigation. `span` renders the decorative form: hidden from assistive
   * technology, out of the tab order, with no pointer and no hover.
   * Its event handlers do not run.
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
        'mt-3 inline-flex items-center gap-2 rounded-[var(--newt-radius-sm)] border-0 bg-newt-bg-elevated px-4 py-1.5 text-sm font-medium text-newt-text-primary no-underline',
        !decorative &&
          'cursor-pointer transition-colors duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        props.class
      )
    "
    v-bind="decorative ? withoutListeners($attrs) : $attrs"
  >
    <slot />
  </component>
</template>
