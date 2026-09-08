<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!--
    The panel that slides in over a channel on narrow screens, holding the
    member list, pins, threads and the rest of the channel detail tabs.
  -->
  <div
    role="dialog"
    :class="
      cn(
        'flex h-full w-full max-w-sm flex-col overflow-hidden bg-newt-bg-surface text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
