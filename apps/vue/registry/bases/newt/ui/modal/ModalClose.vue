<script setup lang="ts">
import { inject } from "vue"

import { MODAL_CONTEXT_KEY } from "."

/**
 * Closes the enclosing Modal when clicked. Renders a wrapper `<span>` so it can
 * wrap any element: `<ModalClose><Button variant="secondary">Cancel</Button></ModalClose>`
 */
const ctx = inject(MODAL_CONTEXT_KEY, null)

function onClick() {
  ctx?.close()
}
</script>

<template>
  <span class="contents" @click="onClick">
    <slot />
  </span>
</template>
