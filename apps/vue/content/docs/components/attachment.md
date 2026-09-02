---
title: Attachment Card
description: File card showing a type icon, file name, size and a download action.
---

<ComponentPreview name="AttachmentDemo" />

## Installation

```bash
npx @newtui/vue@latest add attachment
```

## Usage

```vue
<script setup lang="ts">
import {
  Attachment,
  AttachmentIcon,
  AttachmentMeta,
  AttachmentName,
  AttachmentSize,
} from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"
</script>

<template>
  <Attachment>
    <AttachmentIcon>PDF</AttachmentIcon>
    <AttachmentMeta>
      <AttachmentName>report.pdf</AttachmentName>
      <AttachmentSize>1.2 MB</AttachmentSize>
    </AttachmentMeta>
    <Button variant="icon" aria-label="Download file">⬇</Button>
  </Attachment>
</template>
```
