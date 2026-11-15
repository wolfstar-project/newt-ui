<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The avatar of the referenced author. With a `src` or a `srcset` it is an
 * image. Without either it is a circle that holds the default slot, so an avatar that is an
 * icon can be drawn; the circle sizes an `svg` to 10px. An empty `alt` hides
 * either form from a screen reader.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    src?: string
    srcset?: string
    alt?: string
  }>(),
  { alt: "" }
)
</script>

<template>
  <img
    v-if="props.src !== undefined || props.srcset !== undefined"
    :src="props.src"
    :srcset="props.srcset"
    :alt="props.alt"
    :aria-hidden="props.alt === '' ? true : undefined"
    :class="cn('h-4 w-4 shrink-0 rounded-full object-cover', props.class)"
  />
  <span
    v-else
    :role="props.alt === '' ? undefined : 'img'"
    :aria-label="props.alt === '' ? undefined : props.alt"
    :aria-hidden="props.alt === '' ? true : undefined"
    :class="
      cn(
        'inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-newt-brand text-[9px] font-semibold text-newt-on-accent [&>svg]:h-2.5 [&>svg]:w-2.5',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
