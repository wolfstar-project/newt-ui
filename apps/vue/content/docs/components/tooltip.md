---
title: Tooltip
description: A small floating label that appears above an element on hover or focus.
---

<ComponentPreview name="TooltipDemo" />

## Installation

```bash
npx newt-ui-vue@latest add tooltip
```

## Usage

```vue
<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
</script>

<template>
  <Tooltip>
    <TooltipTrigger>
      <button aria-describedby="help-tip">?</button>
    </TooltipTrigger>
    <TooltipContent id="help-tip">Tooltip text</TooltipContent>
  </Tooltip>
</template>
```
