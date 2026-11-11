<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * One entry. Attributes other than `class` land on the link or the button
 * inside the list item, which is where a listener belongs.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Makes the entry a link. Without it the entry is a button. */
    href?: string
    /** Marks the section being shown. */
    current?: boolean
    /** `danger` is for an entry that destroys something. */
    variant?: "default" | "danger"
    /** A count shown at the end of the entry. */
    badge?: number
  }>(),
  { current: false, variant: "default" }
)

const itemClassName = computed(() =>
  cn(
    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-start font-sans text-[15px] font-medium leading-5 no-underline transition-colors duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50 aria-[current=page]:bg-newt-bg-active",
    props.variant === "danger"
      ? "text-newt-danger"
      : "text-newt-text-secondary hover:text-newt-text-primary aria-[current=page]:text-newt-text-primary"
  )
)
</script>

<template>
  <li :class="props.class">
    <component
      :is="props.href === undefined ? 'button' : 'a'"
      v-bind="$attrs"
      :type="props.href === undefined ? 'button' : undefined"
      :href="props.href"
      :aria-current="props.current ? 'page' : undefined"
      :class="itemClassName"
    >
      <slot />
      <span
        v-if="props.badge !== undefined"
        class="min-w-4 rounded-full bg-newt-danger px-[5px] text-center text-[11px] font-bold leading-4 text-newt-on-accent"
      >
        {{ props.badge }}
      </span>
    </component>
  </li>
</template>
