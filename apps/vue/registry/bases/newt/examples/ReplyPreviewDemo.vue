<script setup lang="ts">
import {
  ReplyPreview,
  ReplyPreviewAction,
  ReplyPreviewAuthor,
  ReplyPreviewAvatar,
  ReplyPreviewCommand,
  ReplyPreviewText,
} from "~~/registry/bases/newt/ui/reply-preview"

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
    <!-- A slash in a square. The chip sizes an icon it is given to 12px. -->
    <ReplyPreview>
      <ReplyPreviewAvatar :src="AVATAR" />
      <ReplyPreviewAuthor>@username</ReplyPreviewAuthor>
      <ReplyPreviewAction>used</ReplyPreviewAction>
      <ReplyPreviewCommand>
        <template #icon>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm9.4 3 1.9.7L9.6 18l-1.9-.7L14.4 6Z"
            />
          </svg>
        </template>
        ban member
      </ReplyPreviewCommand>
    </ReplyPreview>
  </div>
</template>
