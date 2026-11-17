<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Add the check Discord puts on verified applications. */
    verified?: boolean
    /** Accessible name of the tag. `aria-label` still wins. */
    label?: string
    /** Accessible name with `verified`. `aria-label` still wins. */
    verifiedLabel?: string
    /** Fixed accessible name. Wins over `label` and `verifiedLabel`. */
    ariaLabel?: string
  }>(),
  { label: "Application", verifiedLabel: "Verified application" }
)
</script>

<template>
  <span
    role="img"
    :aria-label="
      props.ariaLabel ?? (props.verified ? props.verifiedLabel : props.label)
    "
    :class="
      cn(
        'inline-flex items-center gap-0.5 rounded-[3px] bg-newt-brand px-1 py-px text-[10px] font-semibold uppercase tracking-[0.02em] text-newt-on-accent',
        props.class
      )
    "
  >
    <svg
      v-if="props.verified"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      class="h-2.5 w-2.5"
    >
      <path
        fill="currentColor"
        d="M9.55 17.6 4.4 12.45l1.4-1.4 3.75 3.75 8.65-8.65 1.4 1.4z"
      />
    </svg>
    <slot>BOT</slot>
  </span>
</template>
