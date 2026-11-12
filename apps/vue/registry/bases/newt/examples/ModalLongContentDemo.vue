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

/*
 * Cap the body and let it scroll: the title and the actions stay where they
 * are however long the text gets.
 */
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
  <Modal>
    <ModalTrigger as-child>
      <Button variant="secondary">Read the rules</Button>
    </ModalTrigger>
    <ModalContent :aria-describedby="undefined">
      <ModalHeader>
        <ModalTitle>Server rules</ModalTitle>
      </ModalHeader>
      <ModalBody class="max-h-48 overflow-y-auto">
        <ol class="flex list-decimal flex-col gap-3 ps-5">
          <li v-for="rule in rules" :key="rule">{{ rule }}</li>
        </ol>
      </ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="secondary">Not now</Button>
        </ModalClose>
        <ModalClose as-child>
          <Button>I agree</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>
