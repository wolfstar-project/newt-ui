<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps } from "reka-ui"

/*
 * It has no look of its own. Pass `as-child` to put the state on your own
 * button: `<DrawerTrigger as-child><Button>Open</Button></DrawerTrigger>`.
 * Focus returns to the trigger when the drawer closes. A drawer opened from
 * state alone has no trigger, so handle `@close-auto-focus` on `DrawerContent`
 * to say where focus goes.
 */
const props = defineProps<DialogTriggerProps>()
</script>

<template>
  <DialogTrigger v-bind="props">
    <slot />
  </DialogTrigger>
</template>
