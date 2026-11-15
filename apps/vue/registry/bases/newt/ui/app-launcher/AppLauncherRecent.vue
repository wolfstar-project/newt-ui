<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/* One recent app: a list item holding the button the attributes apply to. */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * How an `<img>` inside fills the tile: `cover` crops it, `contain`
     * shows all of it, for a logo that must not be cut.
     */
    fit?: "cover" | "contain"
  }>(),
  { fit: "cover" }
)
</script>

<template>
  <li class="flex shrink-0">
    <button
      type="button"
      v-bind="$attrs"
      :class="
        cn(
          'inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-0 bg-newt-bg-base p-0 text-newt-text-secondary transition-[filter] duration-fast ease-newt',
          'hover:brightness-110',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
          '[&>img]:h-full [&>img]:w-full [&>svg]:h-6 [&>svg]:w-6',
          props.fit === 'contain'
            ? '[&>img]:object-contain'
            : '[&>img]:object-cover',
          props.class
        )
      "
    >
      <slot />
    </button>
  </li>
</template>
