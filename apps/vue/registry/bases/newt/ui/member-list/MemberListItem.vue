<script setup lang="ts">
import { computed, type HTMLAttributes, type VNode } from "vue"

import { cn } from "@/lib/utils"

/*
 * One member. A plain row has no pointer and no hover, because it does
 * nothing. With `interactive` the row is a button inside the list item, for
 * a row that opens a profile: it takes focus, answers Enter and Space, and
 * shows a hover and a focus ring. Attributes and listeners land on the row.
 *
 * The `decoration` slot is an underlay drawn behind the row, such as a
 * profile decoration. The hover is drawn over it, so it stays visible. An
 * `img` fills the row.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes["class"]
  interactive?: boolean
}>()

defineSlots<{
  default?: () => VNode[]
  decoration?: () => VNode[]
}>()

const rowClass = computed(() =>
  cn(
    "relative isolate flex min-w-0 items-center gap-2.5 rounded-[var(--newt-radius-sm)] px-2 py-1.5",
    props.interactive &&
      "w-full cursor-pointer border-0 bg-transparent text-start after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:transition-colors after:duration-fast after:ease-newt after:content-[''] hover:after:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link",
    props.class
  )
)
</script>

<template>
  <div v-if="props.interactive" role="listitem">
    <button type="button" v-bind="$attrs" :class="rowClass">
      <span
        v-if="$slots.decoration"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit] [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
      >
        <slot name="decoration" />
      </span>
      <slot />
    </button>
  </div>
  <div v-else role="listitem" v-bind="$attrs" :class="rowClass">
    <span
      v-if="$slots.decoration"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit] [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
    >
      <slot name="decoration" />
    </span>
    <slot />
  </div>
</template>
