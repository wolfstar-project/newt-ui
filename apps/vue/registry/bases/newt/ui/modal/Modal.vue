<script setup lang="ts">
import {
  DialogRoot,
  useForwardPropsEmits,
  type DialogRootEmits,
  type DialogRootProps,
} from "reka-ui"

/*
 * Reka owns the behaviour: open state, the focus trap, Escape and outside
 * press, scroll lock, hiding the page from screen readers, and giving focus
 * back to the trigger. Use `v-model:open` to control it. Only the look is
 * newt/ui's.
 */
const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>
