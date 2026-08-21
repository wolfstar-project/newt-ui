<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { skeletonVariants, type SkeletonVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: SkeletonVariants["variant"]
}>()
</script>

<template>
  <div
    aria-hidden="true"
    :data-variant="props.variant ?? 'default'"
    :class="cn(skeletonVariants({ variant: props.variant }), props.class)"
  />
</template>

<style>
@keyframes newt-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
