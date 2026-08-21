<script setup lang="ts">
import { Avatar } from "@/lib/registry/default/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupReactions,
  MessageGroupTime,
} from "@/lib/registry/default/ui/message-group"
import { Reaction } from "@/lib/registry/default/ui/reaction"
import {
  StatusDot,
  StatusIndicator,
} from "@/lib/registry/default/ui/status-indicator"
</script>

<template>
  <MessageGroup class="w-full max-w-md">
    <StatusIndicator>
      <Avatar>U</Avatar>
      <StatusDot status="online" />
    </StatusIndicator>
    <MessageGroupBody>
      <MessageGroupHeader>
        <MessageGroupAuthor>username</MessageGroupAuthor>
        <MessageGroupBotTag />
        <MessageGroupTime>Today at 14:23</MessageGroupTime>
      </MessageGroupHeader>
      <MessageGroupContent>Message content goes here.</MessageGroupContent>
      <MessageGroupReactions>
        <Reaction emoji="👍" :count="1" />
      </MessageGroupReactions>
    </MessageGroupBody>
  </MessageGroup>
</template>
