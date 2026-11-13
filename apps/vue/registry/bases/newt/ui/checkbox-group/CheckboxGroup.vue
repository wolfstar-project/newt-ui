<script setup lang="ts">
import { computed, provide, ref, watch, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { checkboxGroupKey } from "."

/*
 * Several answers out of a visible list, where a radio group takes one. The
 * group owns the set of chosen values; each row is a Reka Checkbox, which
 * owns the role, the space bar and the hidden input a form reads.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Controlled selection (use with v-model). */
    modelValue?: readonly string[]
    defaultValue?: readonly string[]
    /** Accessible name for the group. */
    label?: string
    /** Shared `name` of the rows. A form then receives one entry per checked row. */
    name?: string
    /** Disables every row. */
    disabled?: boolean
  }>(),
  { modelValue: undefined, defaultValue: () => [], disabled: false }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: readonly string[]): void
}>()

const internal = ref<readonly string[]>(props.modelValue ?? props.defaultValue)
watch(
  () => props.modelValue,
  (next) => {
    if (next !== undefined) internal.value = next
  }
)

const values = computed(() => props.modelValue ?? internal.value)
const name = computed(() => props.name)
const disabled = computed(() => props.disabled)

function toggle(value: string) {
  const next = values.value.includes(value)
    ? values.value.filter((each) => each !== value)
    : [...values.value, value]
  if (props.modelValue === undefined) internal.value = next
  emit("update:modelValue", next)
}

provide(checkboxGroupKey, { values, toggle, name, disabled })
</script>

<template>
  <div
    role="group"
    :aria-label="props.label"
    :class="cn('flex flex-col gap-2', props.class)"
  >
    <slot />
  </div>
</template>
