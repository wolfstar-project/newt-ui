---
title: Slash Command Tag
description: Inline monospace tag for referencing a /slash command in text.
---

<ComponentPreview name="SlashCommandDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add slash-command
```

## Usage

```vue
<script setup lang="ts">
import { SlashCommand } from "@/components/ui/slash-command"
</script>

<template>
  <p>Run <SlashCommand command="deploy" /> to ship the latest build.</p>
</template>
```
