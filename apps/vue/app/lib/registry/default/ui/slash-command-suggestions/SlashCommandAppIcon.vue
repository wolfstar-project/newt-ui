<script setup lang="ts">
import { cva } from "class-variance-authority"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const appIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-newt-bg-elevated text-newt-text-muted [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-1/2 [&>svg]:w-1/2",
  {
    variants: {
      size: {
        header: "h-4 w-4",
        row: "h-6 w-6",
        rail: "h-8 w-8",
      },
    },
    defaultVariants: { size: "row" },
  }
)

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    size?: "header" | "row" | "rail"
  }>(),
  { size: "row" }
)
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn(appIconVariants({ size: props.size }), props.class)"
  >
    <slot />
  </span>
</template>
