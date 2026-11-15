<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'relative mb-1 flex min-w-0 items-center gap-1.5 ps-[18px] text-[13px] leading-4 text-newt-text-muted',
        // The elbow that hooks the preview back up to the message above it.
        `before:absolute before:start-0 before:top-1/2 before:h-3 before:w-3 before:-translate-y-full before:rounded-ss-[6px] before:border-s-2 before:border-t-2 before:border-newt-border before:content-['']`,
        // In the reply slot of a message group the preview has no margin and
        // no padding: the row sets the distance to the author line. The reach
        // is the distance from the preview back to the centre of the avatar,
        // from the two properties the group publishes. The fallbacks are the
        // values of a group that does not publish them.
        '[[data-slot=message-reply]_&]:mb-0 [[data-slot=message-reply]_&]:ps-0 [[data-slot=message-reply]_&]:[--newt-reply-spine-reach:calc(var(--newt-message-group-avatar-size,40px)_/_2_+_var(--newt-message-group-gap,16px))]',
        // There the spine leaves the preview. It starts above the centre of
        // the avatar, half a stroke back so the 2px stroke is centred, and
        // stops 4px before the preview.
        '[[data-slot=message-reply]_&]:before:bottom-0 [[data-slot=message-reply]_&]:before:end-[calc(100%_+_4px)] [[data-slot=message-reply]_&]:before:start-[calc(-1_*_var(--newt-reply-spine-reach)_-_1px)] [[data-slot=message-reply]_&]:before:top-[calc(50%_-_1px)] [[data-slot=message-reply]_&]:before:h-auto [[data-slot=message-reply]_&]:before:w-auto [[data-slot=message-reply]_&]:before:translate-y-0',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
