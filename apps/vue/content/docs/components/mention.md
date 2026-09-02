---
title: Mention Chip
description: An inline chip for user, channel and role mentions.
---

<ComponentPreview name="MentionDemo" />

## Installation

```bash
npx @newtui/vue@latest add mention
```

## Usage

```vue
<script setup lang="ts">
import { Mention } from "@/components/ui/mention"
</script>

<template>
  <Mention variant="user">@username</Mention>
  <Mention variant="channel">#channel</Mention>
  <Mention variant="role">@RoleName</Mention>
</template>
```

`variant` accepts `"user"` (default), `"channel"` or `"role"`.
