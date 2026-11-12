<script setup lang="ts">
import { PopoverTrigger, type PopoverTriggerProps } from "reka-ui"

/*
 * It has no look of its own. Pass `as-child` to put the state on your own
 * button, or the classes of the button it should be, for example
 * `:class="buttonVariants({ variant: 'secondary' })"`.
 */
const props = defineProps<PopoverTriggerProps>()
</script>

<template>
  <PopoverTrigger v-bind="props">
    <slot />
  </PopoverTrigger>
</template>
