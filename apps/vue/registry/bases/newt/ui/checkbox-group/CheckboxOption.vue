<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { checkboxGroupKey } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** What this row stands for in the group's value. */
    value: string
    /** The quieter line under the label. */
    description?: string
    disabled?: boolean
  }>(),
  { disabled: false }
)

const group = inject(checkboxGroupKey)
if (group === undefined) {
  throw new Error("<CheckboxOption> must be used inside a <CheckboxGroup>.")
}

const checked = computed(() => group.values.value.includes(props.value))
</script>

<template>
  <label
    :class="
      cn(
        'group flex items-start gap-3 text-[15px] leading-5 text-newt-text-secondary',
        props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        checked && !props.disabled && 'text-newt-text-primary',
        props.class
      )
    "
  >
    <!--
      The input keeps every behaviour it was born with and loses only its
      appearance; the box beside it is the drawing.
    -->
    <input
      type="checkbox"
      class="peer sr-only"
      :name="group.name.value"
      :value="props.value"
      :checked="checked"
      :disabled="props.disabled"
      @change="group.toggle(props.value)"
    />
    <span
      aria-hidden="true"
      :data-checked="checked ? true : undefined"
      :class="
        cn(
          'mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-newt-text-muted transition-colors duration-fast ease-newt',
          'data-[checked]:border-newt-brand data-[checked]:bg-newt-brand',
          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-newt-text-link',
          !props.disabled && 'group-hover:border-newt-text-secondary'
        )
      "
    >
      <svg
        viewBox="0 0 16 16"
        class="h-3.5 w-3.5 scale-0 text-white transition-transform duration-fast ease-newt group-has-[:checked]:scale-100"
      >
        <path
          fill="currentColor"
          d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
        />
      </svg>
    </span>
    <span class="flex min-w-0 flex-col gap-0.5">
      <span><slot /></span>
      <span
        v-if="props.description"
        class="text-[13px] leading-[17px] text-newt-text-muted"
      >
        {{ props.description }}
      </span>
    </span>
  </label>
</template>
