<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  disabled?: boolean
}>()

const checked = defineModel<boolean>({ default: false })

function toggle() {
  if (props.disabled) return
  checked.value = !checked.value
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="checked"
    :data-state="checked ? 'checked' : 'unchecked'"
    :disabled="props.disabled"
    :class="
      cn(
        'inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-newt-border bg-newt-bg-input text-white transition-colors duration-fast ease-newt focus-visible:border-newt-brand focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        checked && 'border-newt-brand bg-newt-brand',
        props.class
      )
    "
    @click="toggle"
  >
    <svg
      v-if="checked"
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  </button>
</template>
