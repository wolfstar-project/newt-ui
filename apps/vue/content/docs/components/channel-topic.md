---
title: Channel Topic Bar
description: A header bar showing the channel name and a truncating topic description.
---

<ComponentPreview name="ChannelTopicDemo" />

## Installation

```bash
npx @newtui/vue@latest add channel-topic
```

## Usage

```vue
<script setup lang="ts">
import {
  ChannelTopic,
  ChannelTopicDescription,
  ChannelTopicDivider,
  ChannelTopicIcon,
  ChannelTopicName,
} from "@/components/ui/channel-topic"
</script>

<template>
  <ChannelTopic>
    <ChannelTopicIcon />
    <ChannelTopicName>channel-name</ChannelTopicName>
    <ChannelTopicDivider />
    <ChannelTopicDescription
      >Channel topic description goes here</ChannelTopicDescription
    >
  </ChannelTopic>
</template>
```
