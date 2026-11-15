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

const props = withDefaults(
  defineProps<{
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
    /**
     * Makes the action a toggle and keeps it lit up while `true`. A button
     * reports the value as `aria-pressed`; leave it unset for a plain action.
     */
    active?: boolean
  }>(),
  /*
   * Vue casts an absent `boolean` prop to `false` unless it has a `default`
   * key. `undefined` here is what tells a plain action from a toggle that is
   * off.
   */
  { active: undefined }
)

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
    :aria-pressed="isButton ? props.active : undefined"
    :data-state="props.active ? 'active' : 'inactive'"
    :class="
      cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-newt-text-muted data-[state=active]:text-newt-text-primary',
        !decorative &&
          'cursor-pointer transition-colors duration-fast ease-newt hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        props.class
      )
    "
    v-bind="decorative ? withoutListeners($attrs) : $attrs"
  >
    <slot />
  </component>
</template>
