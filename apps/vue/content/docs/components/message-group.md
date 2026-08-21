---
title: Message Group
description: A chat message row with avatar, author header, content and reactions.
---

<ComponentPreview name="MessageGroupDemo" />

## Installation

```bash
npx newt-ui-vue@latest add message-group
```

## Usage

```vue
<script setup lang="ts">
import { Avatar } from "@/components/ui/avatar"
import {
  MessageGroup,
  MessageGroupBody,
  MessageGroupHeader,
  MessageGroupAuthor,
  MessageGroupBotTag,
  MessageGroupTime,
  MessageGroupContent,
  MessageGroupReactions,
} from "@/components/ui/message-group"
import { Reaction, ReactionCount } from "@/components/ui/reaction"
</script>

<template>
  <MessageGroup>
    <Avatar>U</Avatar>
    <MessageGroupBody>
      <MessageGroupHeader>
        <MessageGroupAuthor>username</MessageGroupAuthor>
        <MessageGroupBotTag />
        <MessageGroupTime>Today at 14:23</MessageGroupTime>
      </MessageGroupHeader>
      <MessageGroupContent>Message content goes here.</MessageGroupContent>
      <MessageGroupReactions>
        <Reaction>
          <span aria-hidden="true">👍</span>
          <ReactionCount>1</ReactionCount>
        </Reaction>
      </MessageGroupReactions>
    </MessageGroupBody>
  </MessageGroup>
</template>
```
