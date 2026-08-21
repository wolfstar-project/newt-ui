---
title: Select Menu
description: A floating listbox with optional search, section labels, dividers and selected options.
---

<ComponentPreview name="SelectMenuDemo" />

## Installation

```bash
npx newt-ui-vue@latest add select-menu
```

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue"
import {
  SelectMenu,
  SelectMenuDivider,
  SelectMenuLabel,
  SelectMenuOption,
  SelectMenuSearch,
} from "@/components/ui/select-menu"

const query = ref("")
</script>

<template>
  <SelectMenu aria-label="Select an option">
    <SelectMenuSearch
      v-model="query"
      placeholder="Search…"
      aria-label="Search options"
    />
    <SelectMenuLabel>Options</SelectMenuLabel>
    <SelectMenuOption selected>Option one</SelectMenuOption>
    <SelectMenuOption>Option two</SelectMenuOption>
    <SelectMenuDivider />
    <SelectMenuOption>Option three</SelectMenuOption>
  </SelectMenu>
</template>
```

`SelectMenuOption` is presentational: pass `selected` to show the check mark and listen to `@click` to update your own state. `SelectMenuSearch` exposes its text through `v-model`.
