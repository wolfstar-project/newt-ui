---
title: Typing Indicator
description: Three bouncing dots with a label that signals someone is typing.
---

<ComponentPreview name="TypingIndicatorDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add typing-indicator
```

## Usage

```vue
<script setup lang="ts">
import { TypingIndicator } from "@/components/ui/typing-indicator"
</script>

<template>
  <TypingIndicator label="Newt is typing">Newt is typing...</TypingIndicator>
</template>
```

The animation is disabled automatically when the user prefers reduced motion.
