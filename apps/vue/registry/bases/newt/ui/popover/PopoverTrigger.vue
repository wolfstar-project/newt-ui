<script setup lang="ts">
import { inject } from "vue"

import { popoverKey } from "."

/*
 * A plain button that carries the state. It has no look of its own: pass the
 * classes of the button it should be, for example
 * `:class="buttonVariants({ variant: 'secondary' })"`.
 */
const popover = inject(popoverKey)
if (popover === undefined) {
  throw new Error("<PopoverTrigger> must be used inside a <Popover>.")
}
</script>

<template>
  <button
    type="button"
    data-popover-trigger=""
    :aria-expanded="popover.open.value"
    :aria-controls="popover.open.value ? `${popover.id}-content` : undefined"
    @click="popover.open.value = !popover.open.value"
  >
    <slot />
  </button>
</template>
