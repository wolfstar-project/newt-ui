<script setup lang="ts">
import { computed, provide, ref, useId, watch, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { checkboxGroupKey } from "."

/*
 * Several answers out of a visible list, where a radio group takes one. The
 * group owns the set of chosen values; each row is a real `<input>`, so the
 * space bar and the label association come for free and only the box is
 * redrawn.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Controlled selection (use with v-model). */
    modelValue?: readonly string[]
    defaultValue?: readonly string[]
    /** Accessible name for the group. */
    label?: string
    /** Shared `name` for the inputs. One is generated when it is not given. */
    name?: string
  }>(),
  { modelValue: undefined, defaultValue: () => [] }
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
const generated = useId()
const name = computed(() => props.name ?? generated)

function toggle(value: string) {
  const next = values.value.includes(value)
    ? values.value.filter((each) => each !== value)
    : [...values.value, value]
  if (props.modelValue === undefined) internal.value = next
  emit("update:modelValue", next)
}

provide(checkboxGroupKey, { values, toggle, name })
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
