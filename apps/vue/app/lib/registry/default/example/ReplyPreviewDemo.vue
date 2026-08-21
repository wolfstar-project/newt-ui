<script setup lang="ts">
import {
  ReplyPreview,
  ReplyPreviewAuthor,
  ReplyPreviewText,
} from "@/lib/registry/default/ui/reply-preview"
</script>

<template>
  <ReplyPreview>
    <ReplyPreviewAuthor>@username</ReplyPreviewAuthor>
    <ReplyPreviewText>original message text being replied to</ReplyPreviewText>
  </ReplyPreview>
</template>
