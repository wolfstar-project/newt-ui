<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from "reka-ui"
import { computed, inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { checkboxGroupKey } from "."

/* Attributes other than `class` land on the checkbox, not on the label. */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** What this row stands for in the group's value. */
    value: string
    /** The quieter line under the label. */
    description?: string
    disabled?: boolean
    required?: boolean
  }>(),
  { disabled: false, required: false }
)

const group = inject(checkboxGroupKey)
if (group === undefined) {
  throw new Error("<CheckboxOption> must be used inside a <CheckboxGroup>.")
}

const checked = computed(() => group.values.value.includes(props.value))
const isDisabled = computed(() => group.disabled.value || props.disabled)
</script>

<template>
  <!--
    The label wraps the box, so a press on the text reaches it and the text is
    its accessible name.
  -->
  <label
    :class="
      cn(
        'group flex items-start gap-3 text-[15px] leading-5 text-newt-text-secondary',
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        checked && !isDisabled && 'text-newt-text-primary',
        props.class
      )
    "
  >
    <CheckboxRoot
      v-bind="$attrs"
      :name="group.name.value"
      :value="props.value"
      :model-value="checked"
      :disabled="isDisabled"
      :required="props.required"
      :class="
        cn(
          'mt-px flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-newt-text-muted bg-transparent p-0 transition-colors duration-fast ease-newt disabled:cursor-not-allowed',
          'data-[state=checked]:border-newt-brand data-[state=checked]:bg-newt-brand',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
          !isDisabled && 'group-hover:border-newt-text-secondary'
        )
      "
      @update:model-value="group.toggle(props.value)"
    >
      <!-- Mounted in both states, so the check can scale in and out. -->
      <CheckboxIndicator
        force-mount
        class="flex scale-0 text-newt-on-accent transition-transform duration-fast ease-newt data-[state=checked]:scale-100"
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" class="h-3.5 w-3.5">
          <path
            fill="currentColor"
            d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
          />
        </svg>
      </CheckboxIndicator>
    </CheckboxRoot>
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
