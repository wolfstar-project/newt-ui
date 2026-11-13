<script setup lang="ts">
import {
  injectTooltipProviderContext,
  TooltipProvider,
  TooltipRoot,
  useForwardPropsEmits,
  type TooltipRootEmits,
  type TooltipRootProps,
} from "reka-ui"

const props = defineProps<TooltipRootProps>()
const emits = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

/* A tooltip with no `TooltipProvider` above it brings its own. */
const shared = injectTooltipProviderContext(null)
</script>

<template>
  <TooltipRoot v-if="shared" v-bind="forwarded">
    <slot />
  </TooltipRoot>
  <TooltipProvider v-else :delay-duration="props.delayDuration ?? 150">
    <TooltipRoot v-bind="forwarded">
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
