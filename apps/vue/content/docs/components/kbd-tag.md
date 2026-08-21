---
title: Keyboard Shortcut Tag
description: A small monospace tag for displaying keyboard shortcuts.
---

<ComponentPreview name="KbdTagDemo" />

## Installation

```bash
npx newt-ui-vue@latest add kbd-tag
```

## Usage

```vue
<script setup lang="ts">
import { Kbd } from "@/components/ui/kbd-tag"
</script>

<template>
  <Kbd>Ctrl</Kbd>
  <Kbd>K</Kbd>
</template>
```

## Examples

### Inline in text

```vue
<template>
  <p class="text-sm text-newt-text-muted">
    Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open the quick switcher.
  </p>
</template>
```
