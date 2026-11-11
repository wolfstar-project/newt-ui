<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  name: string
  /** The quieter line under the name: a status, a tag, an activity. */
  status?: string
}>()
</script>

<template>
  <div :class="cn('flex min-w-0 flex-1 flex-col', props.class)">
    <span
      class="truncate text-sm font-semibold leading-[18px] text-newt-text-primary"
    >
      {{ props.name }}
    </span>
    <span
      v-if="props.status !== undefined"
      class="truncate text-xs leading-4 text-newt-text-muted"
    >
      {{ props.status }}
    </span>
  </div>
</template>
