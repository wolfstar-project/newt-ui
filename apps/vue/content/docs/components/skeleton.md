---
title: Skeleton Loader
description: A shimmering placeholder shown while content is loading.
---

<ComponentPreview name="SkeletonDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add skeleton
```

## Usage

```vue
<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton"
</script>

<template>
  <div class="flex gap-3">
    <Skeleton variant="avatar" />
    <div class="flex flex-1 flex-col gap-1.5">
      <Skeleton variant="title" />
      <Skeleton variant="text" class="w-[80%]" />
    </div>
  </div>
</template>
```

`variant` accepts `"text"`, `"avatar"`, `"title"` or `"default"`. Animation is disabled when the user prefers reduced motion.
