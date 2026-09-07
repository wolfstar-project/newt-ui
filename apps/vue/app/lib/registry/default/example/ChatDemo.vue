<script setup lang="ts">
import { ref } from "vue"

import { Avatar } from "@/lib/registry/default/ui/avatar"
import { Chat, ChatBody, ChatFooter } from "@/lib/registry/default/ui/chat"
import { MessageComposer } from "@/lib/registry/default/ui/message-composer"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "@/lib/registry/default/ui/message-group"
import { MessageList } from "@/lib/registry/default/ui/message-list"

const value = ref("")
</script>

<template>
  <Chat aria-label="#general channel chat" class="h-80 w-full max-w-md">
    <ChatBody focusable viewport-label="#general channel messages">
      <MessageList label="Messages in #general">
        <MessageGroup>
          <MessageGroupAvatar>
            <Avatar>U</Avatar>
          </MessageGroupAvatar>
          <MessageGroupBody>
            <MessageGroupHeader>
              <MessageGroupAuthor>username</MessageGroupAuthor>
              <MessageGroupTime datetime="2026-09-04T14:23:00.000Z">
                Today at 14:23
              </MessageGroupTime>
            </MessageGroupHeader>
            <MessageGroupContent>Welcome to the channel.</MessageGroupContent>
          </MessageGroupBody>
        </MessageGroup>
      </MessageList>
    </ChatBody>
    <ChatFooter>
      <MessageComposer
        v-model="value"
        channel-name="general"
        @submit="value = ''"
      />
    </ChatFooter>
  </Chat>
</template>
