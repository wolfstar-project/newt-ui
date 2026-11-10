<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { TableSort } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** `end` aligns the column to the inline end, for numbers. */
    align?: "start" | "end"
    /** Makes the heading a button and states the column's sort order. */
    sort?: TableSort
    scope?: "col" | "row"
  }>(),
  { align: "start", scope: "col" }
)

const emit = defineEmits<{
  /** Fired when the sortable heading is activated. */
  (e: "sort"): void
}>()
</script>

<template>
  <th
    :scope="props.scope"
    :aria-sort="props.sort"
    :class="
      cn(
        'whitespace-nowrap border-b border-newt-border bg-newt-bg-elevated px-4 py-2.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted',
        props.align === 'end' ? 'text-end' : 'text-start',
        props.class
      )
    "
  >
    <slot v-if="props.sort === undefined" />
    <button
      v-else
      type="button"
      :class="
        cn(
          '-mx-1.5 -my-1 inline-flex items-center gap-1 rounded-sm px-1.5 py-1 uppercase tracking-[inherit] hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link',
          props.sort !== 'none' && 'text-newt-text-primary'
        )
      "
      @click="emit('sort')"
    >
      <slot />
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        :class="
          cn(
            'h-3 w-3',
            props.sort === 'none' && 'opacity-0',
            props.sort === 'descending' && 'rotate-180'
          )
        "
      >
        <path
          fill="currentColor"
          d="M8 3.5a1 1 0 0 1 .7.3l3.5 3.5a1 1 0 0 1-1.4 1.4L8 5.9 5.2 8.7a1 1 0 0 1-1.4-1.4l3.5-3.5a1 1 0 0 1 .7-.3Z"
        />
      </svg>
    </button>
  </th>
</template>
