---
title: Reply Preview
description: A compact "replying to" bar showing the author and a truncated excerpt of the original message.
---

<ComponentPreview name="ReplyPreviewDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add reply-preview
```

## Usage

```vue
<script setup lang="ts">
import {
  ReplyPreview,
  ReplyPreviewAuthor,
  ReplyPreviewText,
} from "@/components/ui/reply-preview"
</script>

<template>
  <ReplyPreview>
    <ReplyPreviewAuthor>@username</ReplyPreviewAuthor>
    <ReplyPreviewText>original message text being replied to</ReplyPreviewText>
  </ReplyPreview>
</template>
```
