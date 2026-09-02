---
title: Scrollbar Utility
description: Discord-styled thin, rounded scrollbars for any scrollable container.
---

<ComponentPreview name="ScrollbarDemo" />

## Installation

```bash
npx @newtui/vue@latest add scrollbar
```

## Usage

```vue
<script setup lang="ts">
import { ScrollArea, scrollbarClassName } from "@/components/ui/scrollbar"
</script>

<template>
  <ScrollArea class="max-h-[240px] overflow-y-auto">
    <!-- scrollable content -->
  </ScrollArea>
</template>
```

To style an element you already control, bind `scrollbarClassName` to its `class`.
