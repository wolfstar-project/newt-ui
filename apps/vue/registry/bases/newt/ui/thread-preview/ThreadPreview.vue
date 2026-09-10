<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The thread hanging off a message: its name, how many replies it holds, and
 * who spoke last. It is a link to somewhere else, so the whole card is one
 * control rather than a card with a link inside it — one tab stop, one target,
 * and the hover state belongs to all of it.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  href?: string
}>()
</script>

<template>
  <a
    :href="props.href"
    :class="
      cn(
        'flex max-w-[440px] items-center gap-2 rounded-md bg-newt-bg-surface px-3 py-2 text-sm no-underline',
        'transition-colors duration-fast ease-newt hover:bg-newt-bg-elevated',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </a>
</template>
