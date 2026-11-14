<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * The element to render. `div` by default; `article` when each message is a
     * self-contained post, `li` inside a list of messages.
     */
    as?: string | Component
    /**
     * Lay the row out as a 2x2 grid so a `MessageGroupReply` can hook over the
     * avatar, the way the client stacks a reply above the message it answers.
     */
    withReply?: boolean
    /** Tint the row as an ephemeral (visible-to-you-only) response. */
    ephemeral?: boolean
  }>(),
  { as: "div" }
)
</script>

<template>
  <component
    :is="props.as"
    data-slot="message-row"
    :data-ephemeral="props.ephemeral || undefined"
    :class="
      cn(
        // The size of the avatar and the gap beside it. A reply preview in the
        // row reads both, so its spine starts above the centre of the avatar.
        // Set them when the row holds an avatar of another size.
        'gap-x-[var(--newt-message-group-gap)] py-1 [--newt-message-group-avatar-size:40px] [--newt-message-group-gap:16px]',
        // The colour of the message text is on the row and the content
        // inherits it, so a colour class on the row reaches the content. The
        // fallback keeps a project without `--newt-text-message` on the
        // colour it had.
        'text-[color:var(--newt-text-message,var(--newt-text-secondary))]',
        props.withReply
          ? 'grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] items-start gap-y-0.5 [&>[data-slot=message-avatar]]:col-start-1 [&>[data-slot=message-avatar]]:row-start-2 [&>[data-slot=message-body]]:col-start-2 [&>[data-slot=message-body]]:row-start-2 [&>[data-slot=message-reply]]:col-start-2 [&>[data-slot=message-reply]]:row-start-1'
          : 'flex',
        props.ephemeral
          ? 'border-s-2 border-[color-mix(in_srgb,var(--newt-text-link)_40%,transparent)] bg-[color-mix(in_srgb,var(--newt-text-link)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--newt-text-link)_15%,transparent)]'
          : 'hover:bg-newt-bg-message-hover',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
