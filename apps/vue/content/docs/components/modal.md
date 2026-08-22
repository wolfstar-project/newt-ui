---
title: Modal
description: A centered dialog over a dimmed overlay that closes on Escape, overlay click or an explicit close control.
---

<ComponentPreview name="ModalDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add modal
```

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue"
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal"

const open = ref(false)
</script>

<template>
  <Button @click="open = true">Open modal</Button>
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
```

`v-model:open` controls visibility. The modal sets `open` to `false` when the user presses Escape, clicks the overlay, or clicks inside a `ModalClose`. `ModalHeader` is linked to the dialog through `aria-labelledby`.
