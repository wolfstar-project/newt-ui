<script setup lang="ts">
import { computed, ref } from "vue"

import { cn } from "@/lib/utils"

import { provideRadioGroup } from "./useRadioGroup"

/*
 * A radio group: one choice out of a short, visible list. Where a select menu
 * hides its options until asked, this shows them all — which is what the
 * client's settings panels use when there are two or three of them and the
 * difference between them matters.
 */
const props = defineProps<{
  class?: string
  /** Controlled selection. Leave undefined to let the group own it. */
  modelValue?: string
  defaultValue?: string
  /** Accessible name for the group. */
  label?: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
  valueChange: [value: string]
}>()

const internal = ref(props.defaultValue)
const isControlled = computed(() => props.modelValue !== undefined)
const current = computed(() =>
  isControlled.value ? props.modelValue : internal.value
)

/* Registration order is render order, which is the order the arrows walk. */
const order = ref<{ value: string; disabled: boolean }[]>([])

function register(value: string, disabled: boolean) {
  const existing = order.value.find((row) => row.value === value)
  if (existing) existing.disabled = disabled
  else order.value.push({ value, disabled })
}

function select(value: string) {
  if (!isControlled.value) internal.value = value
  emit("update:modelValue", value)
  emit("valueChange", value)
}

provideRadioGroup({ value: current, select, register })

function move(event: KeyboardEvent) {
  const options = order.value.filter((row) => !row.disabled)
  if (options.length === 0) return

  const index = options.findIndex((row) => row.value === current.value)
  const target = {
    ArrowDown: index + 1,
    ArrowRight: index + 1,
    ArrowUp: index - 1,
    ArrowLeft: index - 1,
    Home: 0,
    End: options.length - 1,
  }[event.key]

  if (target === undefined) return
  event.preventDefault()
  const chosen = options[(target + options.length) % options.length]
  if (chosen) select(chosen.value)
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="props.label"
    :class="cn('flex flex-col gap-1', props.class)"
    @keydown="move"
  >
    <slot />
  </div>
</template>
