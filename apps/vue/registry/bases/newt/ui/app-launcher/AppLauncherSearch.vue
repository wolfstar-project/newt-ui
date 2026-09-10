<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Search field wrapper; place an `<AppLauncherSearchInput>` inside it. -->
  <div :class="cn('shrink-0 px-4 pb-3 pt-4', props.class)">
    <div class="relative flex items-center">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
        class="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-newt-text-muted"
      >
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13 13l4 4" />
      </svg>
      <slot />
    </div>
  </div>
</template>
