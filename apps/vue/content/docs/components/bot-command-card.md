---
title: Bot Command Card
description: A card documenting a slash command, its owning bot and its typed options.
---

<ComponentPreview name="BotCommandCardDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add bot-command-card
```

## Usage

```vue
<script setup lang="ts">
import {
  BotCommandCard,
  BotCommandCardDescription,
  BotCommandCardHeader,
  BotCommandCardName,
  BotCommandCardOption,
  BotCommandCardOptions,
} from "@/components/ui/bot-command-card"
</script>

<template>
  <BotCommandCard>
    <BotCommandCardHeader>
      <BotCommandCardName>ban</BotCommandCardName>
      <Badge variant="brand">mod-bot</Badge>
    </BotCommandCardHeader>
    <BotCommandCardDescription
      >Ban a member from the server.</BotCommandCardDescription
    >
    <BotCommandCardOptions>
      <BotCommandCardOption
        name="user"
        type="USER"
        required
        description="Member to ban"
      />
      <BotCommandCardOption
        name="reason"
        type="STRING"
        description="Audit log reason"
      />
    </BotCommandCardOptions>
  </BotCommandCard>
</template>
```

Pass `:slash="false"` to `BotCommandCardName` to omit the leading slash.
