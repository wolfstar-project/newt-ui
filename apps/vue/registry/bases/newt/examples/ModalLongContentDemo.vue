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

/*
 * Cap the body and let it scroll: the title and the actions stay where they
 * are however long the text gets.
 */
const open = ref(false)

const rules = [
  "Be kind. Disagree with the idea, not with the person.",
  "Keep each channel on its topic; off-topic talk goes in the lounge.",
  "No spam, self-promotion or unsolicited direct messages.",
  "Mark spoilers, and keep anything not safe for work out entirely.",
  "Do not share anyone's personal details, including your own.",
  "Use a thread for a long discussion so the channel stays readable.",
  "Listen to the moderators. Appeal a decision in private, not in public.",
  "Report a problem with the report action instead of answering it.",
]
</script>

<template>
  <Button variant="secondary" @click="open = true">Read the rules</Button>
  <Modal v-model:open="open">
    <ModalHeader>Server rules</ModalHeader>
    <ModalBody class="max-h-48 overflow-y-auto">
      <ol class="flex list-decimal flex-col gap-3 ps-5">
        <li v-for="rule in rules" :key="rule">{{ rule }}</li>
      </ol>
    </ModalBody>
    <ModalFooter>
      <ModalClose>
        <Button variant="secondary">Not now</Button>
      </ModalClose>
      <Button @click="open = false">I agree</Button>
    </ModalFooter>
  </Modal>
</template>
