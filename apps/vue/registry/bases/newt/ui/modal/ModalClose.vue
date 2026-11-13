<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from "reka-ui"

/*
 * Closes the modal when activated. Wrap a Button with `as-child` to keep its
 * styling: `<ModalClose as-child><Button variant="secondary">Cancel</Button></ModalClose>`
 */
const props = defineProps<DialogCloseProps>()
</script>

<template>
  <DialogClose v-bind="props">
    <slot />
  </DialogClose>
</template>
