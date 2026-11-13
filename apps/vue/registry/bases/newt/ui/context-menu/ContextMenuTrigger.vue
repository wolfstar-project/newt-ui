<script setup lang="ts">
import { ContextMenuTrigger, type ContextMenuTriggerProps } from "reka-ui"

/*
 * The area that answers the right click. It renders a `span` with no look of
 * its own; pass `as-child` to put it on your own element.
 */
const props = defineProps<ContextMenuTriggerProps>()
</script>

<template>
  <ContextMenuTrigger v-bind="props">
    <slot />
  </ContextMenuTrigger>
</template>
