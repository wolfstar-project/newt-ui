<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    name: string
    description?: string
    /** Marks a paid placement, as the client does for promoted apps. */
    promoted?: boolean
  }>(),
  { promoted: false }
)
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-3 py-3 text-start transition-colors duration-fast ease-newt',
        'hover:bg-newt-bg-hover',
        'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot name="icon" />
    <span class="flex min-w-0 flex-1 flex-col gap-0.5">
      <span class="flex min-w-0 items-center gap-1.5">
        <span
          class="truncate text-base font-medium leading-tight text-newt-text-primary"
        >
          {{ props.name }}
        </span>
        <span
          v-if="props.promoted"
          class="shrink-0 rounded-full bg-newt-text-primary px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-newt-bg-surface"
        >
          Promoted
        </span>
      </span>
      <span
        v-if="props.description"
        class="truncate text-sm leading-snug text-newt-text-muted"
      >
        {{ props.description }}
      </span>
    </span>
  </button>
</template>
