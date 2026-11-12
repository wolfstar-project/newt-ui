<script setup lang="ts">
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "~~/registry/bases/newt/ui/message-group"

/* The tag's three forms: the default, a verified app, and a label of your own. */
</script>

<template>
  <div class="flex w-full max-w-md flex-col">
    <MessageGroup>
      <MessageGroupAvatar>
        <Avatar>W</Avatar>
      </MessageGroupAvatar>
      <MessageGroupBody>
        <MessageGroupHeader>
          <MessageGroupAuthor>welcomer</MessageGroupAuthor>
          <MessageGroupBotTag />
          <MessageGroupTime datetime="2026-09-04T09:02:00.000Z">
            Today at 09:02
          </MessageGroupTime>
        </MessageGroupHeader>
        <MessageGroupContent
          >Say hello to our newest member.</MessageGroupContent
        >
      </MessageGroupBody>
    </MessageGroup>
    <MessageGroup>
      <MessageGroupAvatar>
        <Avatar>M</Avatar>
      </MessageGroupAvatar>
      <MessageGroupBody>
        <MessageGroupHeader>
          <MessageGroupAuthor>modlog</MessageGroupAuthor>
          <MessageGroupBotTag verified />
          <MessageGroupTime datetime="2026-09-04T09:10:00.000Z">
            Today at 09:10
          </MessageGroupTime>
        </MessageGroupHeader>
        <MessageGroupContent
          >Slow mode is on in this channel.</MessageGroupContent
        >
      </MessageGroupBody>
    </MessageGroup>
    <MessageGroup>
      <MessageGroupAvatar>
        <Avatar>N</Avatar>
      </MessageGroupAvatar>
      <MessageGroupBody>
        <MessageGroupHeader>
          <MessageGroupAuthor>news feed</MessageGroupAuthor>
          <MessageGroupBotTag aria-label="Webhook">HOOK</MessageGroupBotTag>
          <MessageGroupTime datetime="2026-09-04T09:15:00.000Z">
            Today at 09:15
          </MessageGroupTime>
        </MessageGroupHeader>
        <MessageGroupContent>Patch 2.4 notes are out.</MessageGroupContent>
      </MessageGroupBody>
    </MessageGroup>
  </div>
</template>
