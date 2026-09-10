<script setup lang="ts">
import {
  Attachment,
  AttachmentIcon,
  AttachmentMeta,
  AttachmentName,
  AttachmentSize,
} from "~~/registry/bases/newt/ui/attachment"
import { Button } from "~~/registry/bases/newt/ui/button"
</script>

<template>
  <Attachment>
    <AttachmentIcon>FILE</AttachmentIcon>
    <AttachmentMeta>
      <AttachmentName>filename.ext</AttachmentName>
      <AttachmentSize>1.2 MB</AttachmentSize>
    </AttachmentMeta>
    <Button variant="secondary" size="icon" aria-label="Download file"
      >⬇</Button
    >
  </Attachment>
</template>
