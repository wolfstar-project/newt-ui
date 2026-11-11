<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import {
  avatarVariants,
  type AvatarVariants,
} from "~~/registry/bases/newt/ui/avatar"

import { cn } from "@/lib/utils"

/*
 * A few avatars, overlapped, and a count for the rest. Each one is ringed in
 * the colour of the surface behind it so the overlap reads as a cut-out; set
 * `--newt-avatar-group-ring` when the group sits on something other than the
 * default surface. `size` is the chip's size: give the avatars the same one.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    size?: AvatarVariants["size"]
    /**
     * How many members are not shown. A count above zero adds a final "+N"
     * chip; the total usually comes from the server, not from the slot.
     */
    overflow?: number
    /** What a screen reader says for the chip. */
    overflowLabel?: (count: number) => string
  }>(),
  { overflow: 0, overflowLabel: (count: number) => `${count} more` }
)
</script>

<template>
  <div
    role="group"
    :class="
      cn(
        'inline-flex items-center [&>*:not(:first-child)]:-ms-2 [&>*]:shadow-[0_0_0_2px_var(--newt-avatar-group-ring,var(--newt-bg-surface))]',
        props.class
      )
    "
  >
    <slot />
    <div
      v-if="props.overflow > 0"
      :class="
        cn(
          avatarVariants({ size: props.size }),
          'bg-newt-bg-active tabular-nums text-newt-text-primary'
        )
      "
    >
      <span aria-hidden="true">+{{ props.overflow }}</span>
      <span class="sr-only">{{ props.overflowLabel(props.overflow) }}</span>
    </div>
  </div>
</template>
