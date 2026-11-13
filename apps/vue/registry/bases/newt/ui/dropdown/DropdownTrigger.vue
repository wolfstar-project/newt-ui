<script setup lang="ts">
import { DropdownMenuTrigger, type DropdownMenuTriggerProps } from "reka-ui"

/*
 * It has no look of its own. Pass `as-child` to put the state on your own
 * button, or the classes of the button it should be, for example
 * `:class="buttonVariants({ variant: 'secondary' })"`.
 */
const props = defineProps<DropdownMenuTriggerProps>()
</script>

<template>
  <DropdownMenuTrigger v-bind="props">
    <slot />
  </DropdownMenuTrigger>
</template>
