<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { PermissionValue } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  disabled?: boolean
}>()

const model = defineModel<PermissionValue>({ default: "inherit" })

const options: { value: PermissionValue; label: string; glyph: string }[] = [
  { value: "deny", label: "Deny", glyph: "✕" },
  { value: "inherit", label: "Inherit", glyph: "/" },
  { value: "allow", label: "Allow", glyph: "✓" },
]

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
    :class="cn('flex gap-1 rounded-sm bg-newt-bg-base p-0.5', props.class)"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="option.value === model"
      :aria-label="option.label"
      :disabled="props.disabled"
      :data-state="option.value === model ? 'active' : 'inactive'"
      :data-value="option.value"
      :class="
        cn(
          'flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-sm text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-secondary disabled:cursor-not-allowed disabled:opacity-50',
          option.value === model && activeClasses[option.value]
        )
      "
      @click="select(option.value)"
    >
      {{ option.glyph }}
    </button>
  </div>
</template>
