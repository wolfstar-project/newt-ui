<script setup lang="ts">
import {
  Attachment,
  AttachmentIcon,
  AttachmentMeta,
  AttachmentName,
  AttachmentSize,
} from "@/lib/registry/default/ui/attachment"
import { Button } from "@/lib/registry/default/ui/button"
</script>

<template>
  <Attachment>
    <AttachmentIcon>FILE</AttachmentIcon>
    <AttachmentMeta>
      <AttachmentName>filename.ext</AttachmentName>
      <AttachmentSize>1.2 MB</AttachmentSize>
    </AttachmentMeta>
    <Button variant="icon" aria-label="Download file">⬇</Button>
  </Attachment>
</template>
