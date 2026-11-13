<script setup lang="ts">
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "~~/registry/bases/newt/ui/modal"
</script>

<template>
  <Modal>
    <ModalTrigger as-child>
      <Button variant="primary">Open modal</Button>
    </ModalTrigger>
    <ModalContent :aria-describedby="undefined">
      <ModalHeader>
        <ModalTitle>Modal title</ModalTitle>
      </ModalHeader>
      <ModalBody>Modal body content goes here.</ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="secondary">Cancel</Button>
        </ModalClose>
        <ModalClose as-child>
          <Button variant="danger">Confirm</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>
