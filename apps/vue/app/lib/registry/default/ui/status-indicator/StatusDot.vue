<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { statusDotVariants, type StatusDotVariants } from "."

const props = withDefaults(
  defineProps<{
    status?: StatusDotVariants["status"]
    class?: HTMLAttributes["class"]
  }>(),
  { status: "offline" }
)
</script>

<template>
  <div
    :data-status="props.status"
    :class="cn(statusDotVariants({ status: props.status }), props.class)"
  />
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
