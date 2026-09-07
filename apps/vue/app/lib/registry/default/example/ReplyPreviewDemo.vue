<script setup lang="ts">
import {
  ReplyPreview,
  ReplyPreviewAction,
  ReplyPreviewAuthor,
  ReplyPreviewAvatar,
  ReplyPreviewCommand,
  ReplyPreviewText,
} from "@/lib/registry/default/ui/reply-preview"

/* Inline so the demo never reaches out to the network for a placeholder. */
const AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='8' fill='%235865f2'/%3E%3C/svg%3E"
</script>

<template>
  <div class="flex flex-col gap-3">
    <ReplyPreview>
      <ReplyPreviewAvatar :src="AVATAR" />
      <ReplyPreviewAuthor>@username</ReplyPreviewAuthor>
      <ReplyPreviewText
        >original message text being replied to</ReplyPreviewText
      >
    </ReplyPreview>
    <ReplyPreview>
      <ReplyPreviewAvatar :src="AVATAR" />
      <ReplyPreviewAuthor>@username</ReplyPreviewAuthor>
      <ReplyPreviewAction>used</ReplyPreviewAction>
      <ReplyPreviewCommand>/ban member</ReplyPreviewCommand>
    </ReplyPreview>
  </div>
</template>
