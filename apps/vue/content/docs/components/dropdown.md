---
title: Dropdown Menu
description: A floating menu panel with icon, label and description items that highlight in brand color.
---

<ComponentPreview name="DropdownDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add dropdown
```

## Usage

```vue
<script setup lang="ts">
import {
  Dropdown,
  DropdownItem,
  DropdownIcon,
  DropdownContent,
  DropdownLabel,
  DropdownDescription,
  DropdownDivider,
} from "@/components/ui/dropdown"
</script>

<template>
  <Dropdown>
    <DropdownItem active>
      <DropdownIcon>⚡</DropdownIcon>
      <DropdownContent>
        <DropdownLabel>Option label</DropdownLabel>
        <DropdownDescription>Option description</DropdownDescription>
      </DropdownContent>
    </DropdownItem>
    <DropdownDivider />
    <DropdownItem>
      <DropdownIcon>⚙</DropdownIcon>
      <DropdownContent>
        <DropdownLabel>Another option</DropdownLabel>
      </DropdownContent>
    </DropdownItem>
  </Dropdown>
</template>
```
