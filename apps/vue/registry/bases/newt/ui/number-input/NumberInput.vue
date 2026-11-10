<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * A number field with its two steppers drawn as real buttons. The input stays
 * `type="number"`, so the arrow keys and the announced range are the
 * browser's. What is typed is kept as text until it parses, so a reader can
 * clear the field or type a minus sign on the way to a number; the value is
 * clamped to `min` and `max` when the field is left. Attributes other than
 * `class` land on the input.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    min?: number
    max?: number
    step?: number
    invalid?: boolean
    disabled?: boolean
    /** Accessible names of the two stepper buttons. */
    decrementLabel?: string
    incrementLabel?: string
  }>(),
  {
    step: 1,
    invalid: false,
    disabled: false,
    decrementLabel: "Decrease",
    incrementLabel: "Increase",
  }
)

const model = defineModel<number>()

const text = ref(model.value === undefined ? "" : String(model.value))
const parsed = computed(() =>
  text.value.trim() === "" ? Number.NaN : Number(text.value)
)

/* A value set from outside that the text does not already spell replaces it. */
watch(model, (next) => {
  if (next !== undefined && next !== parsed.value) text.value = String(next)
})

/** As many decimals as the step has, so 0.1 + 0.2 reads 0.3. */
const decimals = computed(() => {
  const spelled = String(props.step)
  const point = spelled.indexOf(".")
  return point === -1 ? 0 : spelled.length - point - 1
})

function clamp(point: number): number {
  return Math.min(
    props.max ?? Number.POSITIVE_INFINITY,
    Math.max(props.min ?? Number.NEGATIVE_INFINITY, point)
  )
}

function commit(point: number) {
  const next = Number(clamp(point).toFixed(decimals.value))
  text.value = String(next)
  model.value = next
}

function stepBy(direction: 1 | -1) {
  const from = Number.isNaN(parsed.value)
    ? (props.min ?? 0) - direction * props.step
    : parsed.value
  commit(from + direction * props.step)
}

function onInput(event: Event) {
  if (!(event.target instanceof HTMLInputElement)) return
  text.value = event.target.value
  if (!Number.isNaN(parsed.value)) model.value = parsed.value
}

function onBlur() {
  if (!Number.isNaN(parsed.value) && clamp(parsed.value) !== parsed.value) {
    commit(parsed.value)
  }
}

const stepClassName =
  "inline-flex w-9 shrink-0 items-center justify-center text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-newt-text-secondary"
</script>

<template>
  <div
    :data-invalid="props.invalid ? true : undefined"
    :class="
      cn(
        'inline-flex items-stretch overflow-hidden rounded-sm border border-newt-border bg-newt-bg-input transition-colors duration-fast ease-newt focus-within:border-newt-brand data-[invalid]:border-newt-danger group-data-[invalid]/field:border-newt-danger',
        props.disabled && 'opacity-50',
        props.class
      )
    "
  >
    <button
      type="button"
      :aria-label="props.decrementLabel"
      :disabled="
        props.disabled || (props.min !== undefined && parsed <= props.min)
      "
      :class="stepClassName"
      @click="stepBy(-1)"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" class="h-3.5 w-3.5">
        <path fill="currentColor" d="M3 7h10a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2Z" />
      </svg>
    </button>
    <input
      v-bind="$attrs"
      type="number"
      :inputmode="decimals === 0 ? 'numeric' : 'decimal'"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :value="text"
      :disabled="props.disabled"
      :aria-invalid="props.invalid ? true : undefined"
      class="w-16 border-0 bg-transparent px-1 py-2.5 text-center font-sans text-sm tabular-nums text-newt-text-primary [appearance:textfield] focus:outline-none disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      @input="onInput"
      @blur="onBlur"
    />
    <button
      type="button"
      :aria-label="props.incrementLabel"
      :disabled="
        props.disabled || (props.max !== undefined && parsed >= props.max)
      "
      :class="stepClassName"
      @click="stepBy(1)"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" class="h-3.5 w-3.5">
        <path
          fill="currentColor"
          d="M8 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 1 1-2 0V9H3a1 1 0 0 1 0-2h4V3a1 1 0 0 1 1-1Z"
        />
      </svg>
    </button>
  </div>
</template>
