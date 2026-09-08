<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed, provide, ref, watch } from "vue"

import { cn } from "@/lib/utils"

import { TABS_INJECTION_KEY } from "."

const props = defineProps<{
  modelValue?: string
  defaultValue?: string
  class?: HTMLAttributes["class"]
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const internal = ref<string | undefined>(props.modelValue ?? props.defaultValue)

watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined) internal.value = v
  }
)

const value = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internal.value
)

function setValue(next: string) {
  if (props.modelValue === undefined) internal.value = next
  emit("update:modelValue", next)
}

provide(TABS_INJECTION_KEY, { value, setValue })
</script>

<template>
  <div
    role="tablist"
    :class="cn('flex w-fit gap-1 rounded-md bg-newt-bg-base p-1', props.class)"
  >
    <slot />
  </div>
</template>
