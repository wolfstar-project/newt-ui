<script setup lang="ts">
import {
  TabsRoot,
  useForwardPropsEmits,
  type TabsRootEmits,
  type TabsRootProps,
} from "reka-ui"

/*
 * Reka owns the behaviour: roving focus, arrow keys, Home and End, and the
 * tab/panel ids that link each pair. Only the look is newt/ui's.
 */
const props = defineProps<TabsRootProps>()
const emits = defineEmits<TabsRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>
