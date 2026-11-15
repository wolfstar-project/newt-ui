<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * The accessible name of the handle. Pass it to render the handle as a
     * button that expands or collapses the sheet. Without it, the handle is
     * a decorative grip that assistive technology skips.
     */
    label?: string
    /** Whether the sheet is expanded, reported as `aria-expanded`. */
    expanded?: boolean
  }>(),
  /*
   * Vue casts an absent `boolean` prop to `false` unless it has a `default`
   * key. `undefined` keeps `aria-expanded` off a handle that does not say.
   */
  { expanded: undefined }
)

const gripClass = "h-1 w-9 shrink-0 rounded-full bg-newt-border"
</script>

<template>
  <!-- Grip shown when the launcher is presented as a bottom sheet. -->
  <div
    v-if="props.label === undefined"
    aria-hidden="true"
    :class="cn('mx-auto mt-2', gripClass, props.class)"
  />
  <button
    v-else
    type="button"
    :aria-label="props.label"
    :aria-expanded="props.expanded"
    :class="
      cn(
        'group mx-auto mt-1.5 flex h-6 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <span
      aria-hidden="true"
      :class="cn(gripClass, 'group-hover:bg-newt-text-muted')"
    />
  </button>
</template>
