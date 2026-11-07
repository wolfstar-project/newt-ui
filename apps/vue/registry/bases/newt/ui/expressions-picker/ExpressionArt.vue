<script setup lang="ts">
import { cn } from "@/lib/utils"

import type { ExpressionItem } from "."

defineProps<{ item: ExpressionItem; value: string; large?: boolean }>()
</script>

<template>
  <img
    v-if="item.src"
    :src="item.src"
    alt=""
    loading="lazy"
    :class="
      cn(
        'object-contain',
        large
          ? 'size-[calc(var(--newt-expressions-preview-size)-var(--newt-space-3))]'
          : 'size-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))]'
      )
    "
  />
  <span
    v-else-if="item.kind === 'emoji'"
    aria-hidden="true"
    class="text-[length:var(--newt-font-size-expression)] leading-none"
    >{{ value }}</span
  >
  <span
    v-else
    aria-hidden="true"
    class="px-[var(--newt-space-1)] text-center text-[length:var(--newt-font-size-xs)] text-newt-text-secondary"
    >{{ item.label }}</span
  >
</template>
