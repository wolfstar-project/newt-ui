<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const delays = [0, 0.15, 0.3]
</script>

<template>
  <div :class="cn('inline-flex gap-[3px]', props.class)" aria-hidden="true">
    <span
      v-for="delay in delays"
      :key="delay"
      class="h-[6px] w-[6px] rounded-full bg-newt-text-muted animate-[newt-typing-bounce_1.2s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-80"
      :style="{ animationDelay: `${delay}s` }"
    />
  </div>
</template>

<style>
@keyframes newt-typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-3px);
    opacity: 1;
  }
}
</style>
