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
   * navigation. `span` renders plain text: no pointer, no hover and no
   * chevron, and assistive technology still reads it. Its event handlers
   * do not run.
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
const plain = computed(() => tag.value === "span")
</script>

<template>
  <!--
    The channel name as a control, for the narrow header where a press on the
    title opens the channel details. Put `ChannelHeaderIcon` and
    `ChannelHeaderName` inside it: the name is its accessible name.
  -->
  <component
    :is="tag"
    :type="isButton ? 'button' : undefined"
    :href="plain || props.disabled ? undefined : props.href"
    :disabled="isButton ? props.disabled : undefined"
    :aria-disabled="!isButton && !plain && props.disabled ? true : undefined"
    :class="
      cn(
        'inline-flex min-w-0 items-center gap-2 rounded-[var(--newt-radius-sm)] border-0 bg-transparent px-1.5 py-1 text-start text-newt-text-primary no-underline',
        !plain &&
          'cursor-pointer transition-colors duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        props.class
      )
    "
    v-bind="plain ? withoutListeners($attrs) : $attrs"
  >
    <slot />
    <svg
      v-if="!plain"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="h-4 w-4 shrink-0 text-newt-text-muted rtl:-scale-x-100"
    >
      <path d="m6 3.5 4.5 4.5L6 12.5" />
    </svg>
  </component>
</template>
