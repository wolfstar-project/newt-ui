<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- The Apps popout: search, recents, and the apps installed in a server. -->
  <div
    role="dialog"
    :class="
      cn(
        'flex h-[min(680px,calc(100dvh-2rem))] w-full max-w-[504px] flex-col overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface text-newt-text-primary shadow-elevation-high',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
