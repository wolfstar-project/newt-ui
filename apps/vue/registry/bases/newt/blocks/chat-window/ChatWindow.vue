<script setup lang="ts">
import { ref } from "vue"
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import {
  ChannelHeader,
  ChannelHeaderDivider,
  ChannelHeaderIcon,
  ChannelHeaderInfo,
  ChannelHeaderName,
  ChannelHeaderTopic,
} from "~~/registry/bases/newt/ui/channel-header"
import { Chat, ChatBody, ChatFooter } from "~~/registry/bases/newt/ui/chat"
import { MessageComposer } from "~~/registry/bases/newt/ui/message-composer"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "~~/registry/bases/newt/ui/message-group"
import { MessageList } from "~~/registry/bases/newt/ui/message-list"

import type { ChatMessage } from "./types"

/*
 * A whole channel view: header, scrolling message list, composer. Everything
 * here is composed from registry components — the block is the arrangement,
 * not new markup, so restyling it is still a matter of overriding a token.
 */
const props = defineProps<{
  channelName: string
  topic?: string
  messages: readonly ChatMessage[]
}>()

const emit = defineEmits<{ send: [message: string] }>()

const value = ref("")

function submit(message: string) {
  emit("send", message)
  value.value = ""
}
</script>

<template>
  <div>
    <ChannelHeader>
      <ChannelHeaderInfo>
        <ChannelHeaderIcon />
        <ChannelHeaderName>{{ props.channelName }}</ChannelHeaderName>
        <template v-if="props.topic">
          <ChannelHeaderDivider />
          <ChannelHeaderTopic>{{ props.topic }}</ChannelHeaderTopic>
        </template>
      </ChannelHeaderInfo>
    </ChannelHeader>

    <Chat :aria-label="`#${props.channelName} chat`" class="h-96">
      <ChatBody focusable :viewport-label="`#${props.channelName} messages`">
        <MessageList :label="`Messages in #${props.channelName}`">
          <MessageGroup v-for="message in props.messages" :key="message.id">
            <MessageGroupAvatar>
              <Avatar>{{ message.initials }}</Avatar>
            </MessageGroupAvatar>
            <MessageGroupBody>
              <MessageGroupHeader>
                <MessageGroupAuthor>{{ message.author }}</MessageGroupAuthor>
                <MessageGroupTime :date-time="message.sentAt">
                  {{ message.displayTime }}
                </MessageGroupTime>
              </MessageGroupHeader>
              <MessageGroupContent>{{ message.body }}</MessageGroupContent>
            </MessageGroupBody>
          </MessageGroup>
        </MessageList>
      </ChatBody>
      <ChatFooter>
        <MessageComposer
          :channel-name="props.channelName"
          v-model:value="value"
          @submit="submit"
        />
      </ChatFooter>
    </Chat>
  </div>
</template>
