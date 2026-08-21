<script setup lang="ts">
import {
  ChannelTopic,
  ChannelTopicDescription,
  ChannelTopicDivider,
  ChannelTopicIcon,
  ChannelTopicName,
} from "@/lib/registry/default/ui/channel-topic"
</script>

<template>
  <ChannelTopic class="w-full max-w-md">
    <ChannelTopicIcon />
    <ChannelTopicName>channel-name</ChannelTopicName>
    <ChannelTopicDivider />
    <ChannelTopicDescription
      >Channel topic description goes here</ChannelTopicDescription
    >
  </ChannelTopic>
</template>
