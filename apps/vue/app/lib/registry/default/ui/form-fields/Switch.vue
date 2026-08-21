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
    role="switch"
    :aria-checked="checked"
    :data-state="checked ? 'checked' : 'unchecked'"
    :disabled="props.disabled"
    :class="
      cn(
        'relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border border-newt-border bg-newt-bg-elevated transition-colors duration-base ease-newt disabled:cursor-not-allowed disabled:opacity-50',
        checked && 'border-newt-online bg-newt-online',
        props.class
      )
    "
    @click="toggle"
  >
    <span
      aria-hidden="true"
      :class="
        cn(
          'absolute left-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-newt-text-muted transition-[transform,background-color] duration-base ease-newt',
          checked && 'translate-x-4 bg-white'
        )
      "
    />
  </button>
</template>
