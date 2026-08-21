---
title: Avatar
description: A circular user avatar with image support and initials fallback in three sizes.
---

<ComponentPreview name="AvatarDemo" />

## Installation

```bash
npx newt-ui-vue@latest add avatar
```

## Usage

```vue
<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
</script>

<template>
  <Avatar>
    <AvatarImage src="/me.png" alt="@me" />
    <AvatarFallback>N</AvatarFallback>
  </Avatar>
  <Avatar size="sm">N</Avatar>
  <Avatar size="lg">N</Avatar>
</template>
```
