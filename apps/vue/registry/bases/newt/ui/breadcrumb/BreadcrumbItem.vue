<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Where this level leads. Omit it to pass a router link in the slot. */
    href?: string
    /** Marks the page the reader is on; it is text, not a link. */
    current?: boolean
  }>(),
  { current: false }
)
</script>

<template>
  <!-- A router's own link, passed in the slot, is styled from the item. -->
  <li
    :class="
      cn(
        'inline-flex min-w-0 items-center gap-1.5 text-newt-text-secondary [&:not(:first-child)]:before:text-newt-text-muted [&:not(:first-child)]:before:content-[\'/\'] [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-newt-text-link [&_a:hover]:text-newt-text-primary [&_a:hover]:underline [&_a]:rounded-sm [&_a]:text-newt-text-secondary [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-fast [&_a]:ease-newt',
        props.class
      )
    "
  >
    <span
      v-if="props.current"
      aria-current="page"
      class="truncate font-semibold text-newt-text-primary"
    >
      <slot />
    </span>
    <a v-else-if="props.href !== undefined" :href="props.href"><slot /></a>
    <slot v-else />
  </li>
</template>
