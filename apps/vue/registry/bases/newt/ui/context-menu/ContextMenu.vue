<script setup lang="ts">
import {
  ContextMenuRoot,
  useForwardPropsEmits,
  type ContextMenuRootEmits,
  type ContextMenuRootProps,
} from "reka-ui"

/*
 * Reka owns the behaviour: it opens at the pointer on a right click, a long
 * press or the menu key, and handles Escape and outside press, arrow keys,
 * Home and End, typeahead, and focus return. Only the look is newt/ui's.
 */
const props = defineProps<ContextMenuRootProps>()
const emits = defineEmits<ContextMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <ContextMenuRoot v-bind="forwarded">
    <slot />
  </ContextMenuRoot>
</template>
