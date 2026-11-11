<script setup lang="ts">
import type { HTMLAttributes } from "vue"

/*
 * Where the page sits, as an ordered list inside a named `<nav>`. The
 * separator is drawn by the stylesheet, so it is never read out and never
 * copied with the text; a slash reads the same in either direction.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Accessible name of the landmark. */
    label?: string
  }>(),
  { label: "Breadcrumb" }
)
</script>

<template>
  <nav :aria-label="props.label" :class="props.class">
    <ol
      class="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm leading-5"
    >
      <slot />
    </ol>
  </nav>
</template>
