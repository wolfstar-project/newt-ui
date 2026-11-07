<script setup lang="ts">
import { cn } from "@/lib/utils"

import { expressionsPickerVariants, type ExpressionItem } from "."
defineProps<{ items: readonly ExpressionItem[]; disabled?: boolean }>()
const emit = defineEmits<{ select: [item: ExpressionItem] }>()
</script>
<template>
  <ul
    class="m-0 grid max-h-[var(--newt-expressions-results-height)] grid-cols-3 gap-[var(--newt-space-2)] overflow-y-auto p-[var(--newt-space-1)] list-none"
  >
    <li v-for="item in items" :key="item.id">
      <button
        type="button"
        :disabled="disabled || item.disabled"
        :class="
          cn(
            expressionsPickerVariants(),
            'flex h-full w-full min-w-0 flex-col items-center justify-center gap-[var(--newt-space-1)] break-words'
          )
        "
        @click="emit('select', item)"
      >
        <span
          v-if="item.kind === 'emoji'"
          aria-hidden="true"
          class="text-[length:var(--newt-font-size-expression)]"
          >{{ item.value }}</span
        >
        <img
          v-else-if="item.previewSrc"
          :src="item.previewSrc"
          alt=""
          loading="lazy"
          class="size-[var(--newt-expressions-preview-size)] object-contain"
        />
        <span>{{ item.label }}</span>
        <span v-if="item.disabled">Unavailable</span>
      </button>
    </li>
  </ul>
</template>
