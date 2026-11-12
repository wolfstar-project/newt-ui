<script setup lang="ts">
import {
  TooltipProvider,
  TooltipRoot,
  useForwardPropsEmits,
  type TooltipRootEmits,
  type TooltipRootProps,
} from "reka-ui"

/* Each tooltip brings its own provider, so one needs no setup. */
const props = withDefaults(
  defineProps<TooltipRootProps & { delayDuration?: number }>(),
  { delayDuration: 150 }
)
const emits = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TooltipProvider :delay-duration="props.delayDuration">
    <TooltipRoot v-bind="forwarded">
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
