<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!--
    The picker that opens above the composer once a message starts with `/`.
    Focus stays in the composer: wire `aria-activedescendant` on the input to
    the id of the active option rather than moving focus into the list.

    A grid, so the parts need no wrapper: the rail and the list share the first
    row, the footer takes the second, and a rail laid as a row takes the third.
    The picker is a size container: its parts change layout from its own width,
    not from the viewport. Set `--newt-slash-suggestions-max-width` to change
    the 640px cap, or to `none` to fill the composer.
  -->
  <div
    :class="
      cn(
        'grid max-h-80 w-full max-w-[var(--newt-slash-suggestions-max-width,640px)] grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto_auto] overflow-hidden rounded-[var(--newt-radius-lg)] bg-newt-bg-floating text-newt-text-primary shadow-elevation-high [container-type:inline-size]',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
