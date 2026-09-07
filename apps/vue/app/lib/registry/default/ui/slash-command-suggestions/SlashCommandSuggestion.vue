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
  <div
    role="option"
    :aria-selected="props.active"
    :aria-disabled="props.disabled || undefined"
    :data-state="props.active ? 'active' : 'inactive'"
    :class="
      cn(
        'grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-1.5',
        props.disabled
          ? 'cursor-default opacity-60'
          : 'cursor-pointer hover:bg-newt-bg-hover',
        'data-[state=active]:bg-newt-bg-active',
        props.class
      )
    "
  >
    <slot name="icon" />
    <div class="flex min-w-0 flex-col gap-0.5">
      <!-- The client spaces the slash away from the command path. -->
      <span
        class="text-[15px] font-semibold leading-tight text-newt-text-primary"
      >
        /&nbsp;{{ props.name }}
      </span>
      <span
        v-if="props.description"
        class="truncate text-[13px] leading-snug text-newt-text-secondary"
      >
        {{ props.description }}
      </span>
    </div>
    <span
      v-if="props.appLabel"
      class="shrink-0 text-[13px] text-newt-text-secondary"
    >
      {{ props.appLabel }}
    </span>
  </div>
</template>
