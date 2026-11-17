<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import {
  defaultPermissionStateLabels,
  type PermissionStateLabels,
  type PermissionValue,
} from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  disabled?: boolean
  /** Replaces the English names; omitted keys keep their default. */
  labels?: Partial<PermissionStateLabels>
}>()

const model = defineModel<PermissionValue>({ default: "inherit" })

const options: { value: PermissionValue; glyph: string }[] = [
  { value: "deny", glyph: "✕" },
  { value: "inherit", glyph: "/" },
  { value: "allow", glyph: "✓" },
]

const labels = computed(() => ({
  ...defaultPermissionStateLabels,
  ...props.labels,
}))

const activeClasses = {
  deny: "bg-[rgba(242,63,66,0.15)] text-newt-dnd hover:text-newt-dnd",
  inherit: "bg-newt-bg-elevated text-newt-text-secondary",
  allow: "bg-[rgba(35,165,90,0.15)] text-newt-online hover:text-newt-online",
} satisfies Record<PermissionValue, string>

function select(value: PermissionValue) {
  if (props.disabled) return
  model.value = value
}
</script>

<template>
  <div
    role="group"
    :class="
      cn(
        'flex gap-1 rounded-[var(--newt-radius-sm)] bg-newt-bg-base p-0.5',
        props.class
      )
    "
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="option.value === model"
      :aria-label="labels[option.value]"
      :disabled="props.disabled"
      :data-state="option.value === model ? 'active' : 'inactive'"
      :data-value="option.value"
      :class="
        cn(
          'flex h-7 w-7 cursor-pointer items-center justify-center rounded-[var(--newt-radius-sm)] border-0 bg-transparent text-sm text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-secondary disabled:cursor-not-allowed disabled:opacity-50',
          option.value === model && activeClasses[option.value]
        )
      "
      @click="select(option.value)"
    >
      {{ option.glyph }}
    </button>
  </div>
</template>
