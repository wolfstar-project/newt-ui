<script setup lang="ts">
import {
  PopoverRoot,
  useForwardPropsEmits,
  type PopoverRootEmits,
  type PopoverRootProps,
} from "reka-ui"

/*
 * Reka owns the behaviour: open state, Escape and outside press, focus return
 * to the trigger, and collision-aware placement. Use `v-model:open` to control
 * it; without one the popover owns its state. Only the look is newt/ui's.
 */
const props = defineProps<PopoverRootProps>()
const emits = defineEmits<PopoverRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <PopoverRoot v-bind="forwarded">
    <slot />
  </PopoverRoot>
</template>
