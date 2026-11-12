<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Field,
  FieldHelp,
  Input,
  Label,
} from "~~/registry/bases/newt/ui/form-fields"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
} from "~~/registry/bases/newt/ui/modal"

/*
 * The form wraps the body and the footer, so Enter in the field submits it.
 * The field is the dialog's first control, which is where focus lands.
 */
const open = ref(false)
const name = ref("")

function create() {
  open.value = false
  name.value = ""
}
</script>

<template>
  <Button variant="primary" @click="open = true">Create channel</Button>
  <Modal v-model:open="open">
    <ModalHeader>Create channel</ModalHeader>
    <form @submit.prevent="create">
      <ModalBody>
        <Field>
          <Label for="modal-form-channel-name">Channel name</Label>
          <Input
            id="modal-form-channel-name"
            v-model="name"
            placeholder="new-channel"
          />
          <FieldHelp>Lowercase, with dashes instead of spaces.</FieldHelp>
        </Field>
      </ModalBody>
      <ModalFooter>
        <ModalClose>
          <Button variant="secondary">Cancel</Button>
        </ModalClose>
        <Button type="submit" :disabled="name.trim() === ''">Create</Button>
      </ModalFooter>
    </form>
  </Modal>
</template>
