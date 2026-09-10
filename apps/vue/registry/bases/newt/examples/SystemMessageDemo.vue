<script setup lang="ts">
import {
  SystemMessage,
  SystemMessageActor,
  SystemMessageTime,
} from "~~/registry/bases/newt/ui/system-message"
</script>

<template>
  <div class="flex w-full max-w-[420px] flex-col gap-1">
    <SystemMessage kind="join">
      <SystemMessageActor>someone</SystemMessageActor> joined the channel.
      <SystemMessageTime>Today at 09:41</SystemMessageTime>
    </SystemMessage>
    <SystemMessage kind="boost">
      <SystemMessageActor>another</SystemMessageActor> boosted the server.
      <SystemMessageTime>Today at 10:02</SystemMessageTime>
    </SystemMessage>
    <SystemMessage kind="pin">
      <SystemMessageActor>a moderator</SystemMessageActor> pinned a message.
      <SystemMessageTime>Today at 10:15</SystemMessageTime>
    </SystemMessage>
  </div>
</template>
