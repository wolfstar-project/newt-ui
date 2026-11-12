<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalHeader,
} from "~~/registry/bases/newt/ui/modal"

/*
 * A dialog that only informs needs no footer: one `ModalClose` in the corner
 * is its way out. It sits outside the header so "Close" stays out of the
 * dialog's accessible name.
 */
const open = ref(false)
</script>

<template>
  <Button variant="secondary" @click="open = true">What's new</Button>
  <Modal v-model:open="open" class="relative">
    <ModalHeader class="pe-12">What's new</ModalHeader>
    <ModalBody>
      Threads now keep their place when you switch channels, and the member list
      remembers which roles you collapsed.
    </ModalBody>
    <ModalClose>
      <button
        type="button"
        aria-label="Close"
        class="absolute end-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-newt-text-muted transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" class="h-4 w-4">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            d="m4 4 8 8m0-8-8 8"
          />
        </svg>
      </button>
    </ModalClose>
  </Modal>
</template>
