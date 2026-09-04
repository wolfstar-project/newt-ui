<script setup lang="ts">
import { Avatar } from "@/lib/registry/default/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupEphemeralAction,
  MessageGroupEphemeralNotice,
  MessageGroupHeader,
  MessageGroupReactions,
  MessageGroupReply,
  MessageGroupTime,
} from "@/lib/registry/default/ui/message-group"
import { Reaction } from "@/lib/registry/default/ui/reaction"
import {
  ReplyPreview,
  ReplyPreviewAuthor,
  ReplyPreviewText,
} from "@/lib/registry/default/ui/reply-preview"
import {
  StatusDot,
  StatusIndicator,
} from "@/lib/registry/default/ui/status-indicator"
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <MessageGroup with-reply>
      <MessageGroupReply>
        <ReplyPreview>
          <ReplyPreviewAuthor>@someone</ReplyPreviewAuthor>
          <ReplyPreviewText>original message text</ReplyPreviewText>
        </ReplyPreview>
      </MessageGroupReply>
      <MessageGroupAvatar>
        <StatusIndicator>
          <Avatar>U</Avatar>
          <StatusDot status="online" />
        </StatusIndicator>
      </MessageGroupAvatar>
      <MessageGroupBody>
        <MessageGroupHeader>
          <MessageGroupAuthor>username</MessageGroupAuthor>
          <MessageGroupBotTag verified />
          <MessageGroupTime datetime="2026-09-04T14:23:00.000Z">
            Today at 14:23
          </MessageGroupTime>
        </MessageGroupHeader>
        <MessageGroupContent>Message content goes here.</MessageGroupContent>
        <MessageGroupReactions>
          <Reaction emoji="👍" :count="1" />
        </MessageGroupReactions>
      </MessageGroupBody>
    </MessageGroup>
    <MessageGroup ephemeral>
      <MessageGroupAvatar>
        <Avatar>B</Avatar>
      </MessageGroupAvatar>
      <MessageGroupBody>
        <MessageGroupHeader>
          <MessageGroupAuthor>botname</MessageGroupAuthor>
          <MessageGroupBotTag>APP</MessageGroupBotTag>
        </MessageGroupHeader>
        <MessageGroupContent>Command ran successfully.</MessageGroupContent>
        <MessageGroupEphemeralNotice>
          Only you can see this •
          <MessageGroupEphemeralAction>
            Dismiss message
          </MessageGroupEphemeralAction>
        </MessageGroupEphemeralNotice>
      </MessageGroupBody>
    </MessageGroup>
  </div>
</template>
