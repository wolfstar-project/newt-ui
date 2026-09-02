---
title: Toast
description: A transient notification with a status icon that auto-dismisses after a timeout or when closed.
---

<ComponentPreview name="ToastDemo" />

## Installation

```bash
npx @newtui/vue@latest add toast
```

## Usage

```vue
<script setup lang="ts">
import {
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"
</script>

<template>
  <Toast
    variant="success"
    :duration="5000"
    @update:open="(open) => !open && remove()"
  >
    <ToastIcon />
    <ToastContent>
      <ToastTitle>Success title</ToastTitle>
      <ToastDescription>Description text.</ToastDescription>
    </ToastContent>
    <ToastClose />
  </Toast>
</template>
```

Pass `variant="error"` for a red icon, or `:duration="0"` to disable auto-dismiss.
