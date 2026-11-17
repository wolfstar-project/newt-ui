<script setup lang="ts">
import { ref } from "vue"
import { MessageComposer } from "~~/registry/bases/newt/ui/message-composer"
import { SlashCommand } from "~~/registry/bases/newt/ui/slash-command"

/*
 * A field of its own: the command as a chip, then an input for its last
 * option. Enter still submits, and the send button still follows the value.
 */
const reason = ref("")
const options = [{ name: "user", value: "@username" }]
</script>

<template>
  <MessageComposer
    v-model="reason"
    channel-name="moderation"
    placeholder="Reason for the ban"
    class="w-full max-w-md"
    @submit="reason = ''"
  >
    <template #input="{ value, setValue, inputProps }">
      <SlashCommand
        name="ban"
        subcommand="member"
        :options="options"
        class="shrink-0"
      />
      <input
        type="text"
        v-bind="inputProps"
        :value="value"
        class="w-full min-w-0 border-0 bg-transparent font-sans text-[15px] text-newt-text-primary outline-none placeholder:text-newt-text-muted"
        @input="setValue(($event.target as HTMLInputElement).value)"
      />
    </template>
  </MessageComposer>
</template>
