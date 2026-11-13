<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from "reka-ui"

/*
 * Closes the drawer when activated. Wrap a Button with `as-child` to keep its
 * styling: `<DrawerClose as-child><Button variant="secondary">Cancel</Button></DrawerClose>`
 */
const props = defineProps<DialogCloseProps>()
</script>

<template>
  <DialogClose v-bind="props">
    <slot />
  </DialogClose>
</template>
