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
    :href="decorative ? undefined : props.href"
    :aria-hidden="decorative ? true : undefined"
    :aria-pressed="isButton ? props.active : undefined"
    :data-state="props.active ? 'active' : 'inactive'"
    :class="
      cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-newt-text-muted data-[state=active]:text-newt-text-primary',
        !decorative &&
          'cursor-pointer transition-colors duration-fast ease-newt hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
