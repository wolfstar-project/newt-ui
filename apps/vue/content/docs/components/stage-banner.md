---
title: Stage Banner
description: A full-width announcement strip with a status dot, optional action button and dismiss control.
---

<ComponentPreview name="StageBannerDemo" />

## Installation

```bash
npx newt-ui-vue@latest add stage-banner
```

## Usage

```vue
<script setup lang="ts">
import {
  StageBanner,
  StageBannerDot,
  StageBannerAction,
  StageBannerClose,
} from "@/components/ui/stage-banner"
</script>

<template>
  <StageBanner>
    <StageBannerDot />
    Announcement text goes here.
    <StageBannerAction>Action</StageBannerAction>
  </StageBanner>

  <StageBanner variant="neutral">
    <StageBannerDot status="online" />
    Status message goes here.
    <StageBannerClose
      class="text-newt-text-muted hover:text-newt-text-primary"
    />
  </StageBanner>
</template>
```

`StageBannerClose` hides the banner when clicked. Use `v-model:open` to control visibility yourself.
