<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /**
   * Lay the row out as a 2x2 grid so a `MessageGroupReply` can hook over the
   * avatar, the way the client stacks a reply above the message it answers.
   */
  withReply?: boolean
  /** Tint the row as an ephemeral (visible-to-you-only) response. */
  ephemeral?: boolean
}>()
</script>

<template>
  <div
    data-slot="message-row"
    :data-ephemeral="props.ephemeral || undefined"
    :class="
      cn(
        'gap-4 py-1',
        props.withReply
          ? 'grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] items-start [&>[data-slot=message-avatar]]:col-start-1 [&>[data-slot=message-avatar]]:row-start-2 [&>[data-slot=message-body]]:col-start-2 [&>[data-slot=message-body]]:row-start-2 [&>[data-slot=message-reply]]:col-start-2 [&>[data-slot=message-reply]]:row-start-1'
          : 'flex',
        props.ephemeral
          ? 'border-l-2 border-[color-mix(in_srgb,var(--newt-text-link)_40%,transparent)] bg-[color-mix(in_srgb,var(--newt-text-link)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--newt-text-link)_15%,transparent)]'
          : 'hover:bg-black/[0.06]',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
