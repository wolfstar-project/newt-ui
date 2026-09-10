<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import {
  systemMessageIcons,
  systemMessageVariants,
  type SystemMessageKind,
} from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    kind?: SystemMessageKind
  }>(),
  { kind: "join" }
)
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center gap-3 px-2 py-1 text-sm leading-[1.375] text-newt-text-muted',
        props.class
      )
    "
  >
    <span
      aria-hidden="true"
      :class="
        cn(
          'flex h-4 w-4 items-center justify-center',
          systemMessageVariants({ kind: props.kind })
        )
      "
    >
      <!-- `icon` replaces the drawn glyph, for an event this list misses. -->
      <slot name="icon">
        <svg viewBox="0 0 24 24" class="h-full w-full">
          <path fill="currentColor" :d="systemMessageIcons[props.kind]" />
        </svg>
      </slot>
    </span>
    <span class="min-w-0"><slot /></span>
  </div>
</template>
