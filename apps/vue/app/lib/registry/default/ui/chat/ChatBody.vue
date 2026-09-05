<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { ScrollArea } from "@/lib/registry/default/ui/scrollbar"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  focusable?: boolean
  viewportLabel?: string
}>()
</script>

<template>
  <ScrollArea
    :focusable="props.focusable"
    :viewport-label="props.viewportLabel"
    :class="cn('min-h-0 flex-1', props.class)"
  >
    <!--
      Pins a short conversation to the bottom of the scrollport, the way a
      channel with three messages still reads from the composer upwards.
    -->
    <div class="flex min-h-full flex-col justify-end">
      <slot />
    </div>
  </ScrollArea>
</template>
