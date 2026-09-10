<script setup lang="ts">
import { computed, provide, ref, toRef, watch, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { pollKey } from "."

/*
 * A poll in a message: a question, the answers, and what everyone picked.
 *
 * The bar behind each answer is the result, so it only exists once the results
 * are showing. Percentages are computed from the counts rather than passed in,
 * because two numbers that must agree are one number too many.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Every vote cast, which is what the percentages are taken out of. */
    total?: number
    /** Shows the bars and the counts. A closed poll always shows them. */
    showResults?: boolean
    /** Whether more than one answer can be picked. */
    multiple?: boolean
    /** Controlled selection (use with v-model). */
    modelValue?: readonly string[]
    defaultValue?: readonly string[]
  }>(),
  {
    total: 0,
    showResults: false,
    multiple: false,
    modelValue: undefined,
    defaultValue: () => [],
  }
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

const selected = computed(() => props.modelValue ?? internal.value)

function choose(value: string) {
  const next = props.multiple
    ? selected.value.includes(value)
      ? selected.value.filter((each) => each !== value)
      : [...selected.value, value]
    : [value]
  if (props.modelValue === undefined) internal.value = next
  emit("update:modelValue", next)
}

provide(pollKey, {
  total: toRef(props, "total"),
  showResults: toRef(props, "showResults"),
  selected,
  choose,
})
</script>

<template>
  <div
    :class="
      cn(
        'flex w-full max-w-[440px] flex-col gap-3 rounded-lg border border-newt-border bg-newt-bg-surface p-4',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
