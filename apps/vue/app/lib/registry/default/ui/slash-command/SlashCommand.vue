<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Command name rendered after the leading slash. */
  command?: string
}>()
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center gap-[6px] rounded-sm bg-[rgba(88,101,242,0.15)] py-[2px] pl-[6px] pr-2 font-mono text-[13px] text-[#b3baff]',
        props.class
      )
    "
  >
    <span class="opacity-80" aria-hidden="true">/</span>
    <slot>{{ command }}</slot>
  </span>
</template>
