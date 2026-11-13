<script setup lang="ts">
import { TooltipProvider, type TooltipProviderProps } from "reka-ui"

/*
 * Optional. Wrap a group of tooltips in one provider and they share its
 * delays: after one closes, its neighbour opens with no wait.
 */
const props = withDefaults(defineProps<TooltipProviderProps>(), {
  delayDuration: 150,
})
</script>

<template>
  <TooltipProvider v-bind="props">
    <slot />
  </TooltipProvider>
</template>
