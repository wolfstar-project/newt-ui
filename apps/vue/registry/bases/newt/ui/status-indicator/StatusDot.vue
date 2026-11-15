<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { statusDotVariants, type StatusDotVariants } from "."

const props = withDefaults(
  defineProps<{
    status?: StatusDotVariants["status"]
    /**
     * The state in words, such as "Online". It is read by a screen reader and
     * not shown. Leave it out when the state is already written beside the dot.
     */
    label?: string
    class?: HTMLAttributes["class"]
  }>(),
  { status: "offline" }
)
</script>

<template>
  <div
    :data-status="props.status"
    :class="cn(statusDotVariants({ status: props.status }), props.class)"
  >
    <span v-if="props.label !== undefined" class="sr-only">{{
      props.label
    }}</span>
    <slot />
  </div>
</template>

<style>
@keyframes newt-presence-pulse {
  0% {
    transform: scale(0.7);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>
