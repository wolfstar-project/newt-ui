---
title: Context Menu
description: A floating right-click style menu with items, keyboard shortcuts, dividers and a danger variant.
---

<ComponentPreview name="ContextMenuDemo" />

## Installation

```bash
npx @newtui/vue@latest add context-menu
```

## Usage

```vue
<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"
</script>

<template>
  <ContextMenu>
    <ContextMenuItem>Action one</ContextMenuItem>
    <ContextMenuItem>
      Action two
      <ContextMenuShortcut>Ctrl+K</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuDivider />
    <ContextMenuItem variant="danger">Delete</ContextMenuItem>
  </ContextMenu>
</template>
```
