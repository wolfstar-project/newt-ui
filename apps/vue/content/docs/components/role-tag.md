---
title: Role Tag
description: A compact bordered tag with a coloured dot for displaying a member's role.
---

<ComponentPreview name="RoleTagDemo" />

## Installation

```bash
npx newt-ui-vue@latest add role-tag
```

## Usage

```vue
<script setup lang="ts">
import { RoleTag, RoleTagDot } from "@/components/ui/role-tag"
</script>

<template>
  <RoleTag color="#5865f2">
    <RoleTagDot />
    Admin
  </RoleTag>
</template>
```

Pass `color` to tint the tag; the dot follows via `currentColor`.
