<script setup lang="ts">
import {
  DropdownMenuRoot,
  useForwardPropsEmits,
  type DropdownMenuRootEmits,
  type DropdownMenuRootProps,
} from "reka-ui"

/*
 * Reka owns the behaviour: open state, Escape and outside press, focus return
 * to the trigger, arrow keys, Home and End, typeahead, and collision-aware
 * placement. Use `v-model:open` to control it; without one the menu owns its
 * state. Only the look is newt/ui's.
 */
const props = defineProps<DropdownMenuRootProps>()
const emits = defineEmits<DropdownMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded">
    <slot />
  </DropdownMenuRoot>
</template>
