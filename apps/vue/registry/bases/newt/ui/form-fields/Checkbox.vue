<script setup lang="ts">
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
  type CheckboxRootEmits,
  type CheckboxRootProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * Reka owns the behaviour: the role, the checked state, the space bar and the
 * hidden input a form reads when the checkbox carries a `name`.
 */
const props = defineProps<
  CheckboxRootProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<CheckboxRootEmits>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn(
        'inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-newt-border bg-newt-bg-input text-newt-on-accent transition-colors duration-fast ease-newt focus-visible:border-newt-brand focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-newt-brand data-[state=checked]:bg-newt-brand',
        props.class
      )
    "
  >
    <CheckboxIndicator class="flex">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 8.5 6.5 12 13 4.5" />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
