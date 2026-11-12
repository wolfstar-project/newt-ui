<script setup lang="ts">
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "~~/registry/bases/newt/ui/modal"

/*
 * A dialog that only informs needs no footer: one `ModalClose` in the corner
 * is its way out. It sits outside the header so "Close" stays out of the
 * dialog's accessible name. The body text is the description, so a screen
 * reader reads it after the title.
 */
</script>

<template>
  <Modal>
    <ModalTrigger as-child>
      <Button variant="secondary">What's new</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalHeader class="pe-12">
        <ModalTitle>What's new</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <ModalDescription>
          Threads now keep their place when you switch channels, and the member
          list remembers which roles you collapsed.
        </ModalDescription>
      </ModalBody>
      <ModalClose
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
      </ModalClose>
    </ModalContent>
  </Modal>
</template>
