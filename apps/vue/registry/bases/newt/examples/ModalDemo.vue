<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
} from "~~/registry/bases/newt/ui/modal"

const open = ref(false)
</script>

<template>
  <Button variant="primary" @click="open = true">Open modal</Button>
  <Modal v-model:open="open">
    <ModalHeader>Modal title</ModalHeader>
    <ModalBody>Modal body content goes here.</ModalBody>
    <ModalFooter>
      <ModalClose>
        <Button variant="secondary">Cancel</Button>
      </ModalClose>
      <Button variant="danger" @click="open = false">Confirm</Button>
    </ModalFooter>
  </Modal>
</template>
