<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Command path without the leading slash, e.g. `moderation ban`. */
    name: string
    description?: string
    /** Name of the app the command belongs to, shown on the right. */
    appLabel?: string
    active?: boolean
    disabled?: boolean
  }>(),
  { active: false, disabled: false }
)
</script>

<template>
  <!--
    In a picker narrower than 480px, the app name moves beside the command
    name, and the description takes the full width under them, on up to two
    lines.
  -->
  <div
    role="option"
    :aria-selected="props.active"
    :aria-disabled="props.disabled || undefined"
    :data-state="props.active ? 'active' : 'inactive'"
    :class="
      cn(
        'grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--newt-radius-md)] px-2 py-1.5',
        '[@container_(max-width:480px)]:gap-x-2 [@container_(max-width:480px)]:gap-y-0.5',
        props.disabled
          ? 'cursor-default opacity-60'
          : 'cursor-pointer hover:bg-newt-bg-hover',
        'data-[state=active]:bg-newt-bg-active',
        props.class
      )
    "
  >
    <slot name="icon" />
    <div
      class="flex min-w-0 flex-col gap-0.5 [@container_(max-width:480px)]:contents"
    >
      <span
        class="text-[15px] font-semibold leading-tight text-newt-text-primary [@container_(max-width:480px)]:col-start-2 [@container_(max-width:480px)]:row-start-1"
      >
        <!-- The slash stands off the command path. A margin keeps the text `/ban`. -->
        <span class="me-1">/</span>{{ props.name }}
      </span>
      <span
        v-if="props.description"
        class="truncate text-[13px] leading-snug text-newt-text-secondary [@container_(max-width:480px)]:col-[2/-1] [@container_(max-width:480px)]:row-start-2 [@container_(max-width:480px)]:line-clamp-2 [@container_(max-width:480px)]:whitespace-normal"
      >
        {{ props.description }}
      </span>
    </div>
    <span
      v-if="props.appLabel"
      class="shrink-0 text-[13px] text-newt-text-secondary [@container_(max-width:480px)]:col-start-3 [@container_(max-width:480px)]:row-start-1"
    >
      {{ props.appLabel }}
    </span>
  </div>
</template>
