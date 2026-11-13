<script setup lang="ts">
import {
  ProgressIndicator,
  ProgressRoot,
  type ProgressRootProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { type ProgressVariants, progressVariants } from "."

/*
 * Reka owns the semantics: `role="progressbar"`, the `aria-value*`
 * attributes and `data-state` (`loading` or `complete`). Only the look is
 * newt/ui's.
 */
const props = withDefaults(
  defineProps<
    Pick<ProgressRootProps, "as" | "asChild"> & {
      /** Current value, 0–max */
      value?: number
      max?: number
      /** Builds `aria-valuetext`. The default is the rounded percentage. */
      getValueLabel?: (value: number, max: number) => string
      variant?: ProgressVariants["variant"]
      indicatorClass?: HTMLAttributes["class"]
      class?: HTMLAttributes["class"]
    }
  >(),
  {
    value: 0,
    max: 100,
    getValueLabel: (value: number, max: number) =>
      `${Math.round((value / max) * 100)}%`,
  }
)

/* Reka reads a value outside 0–max as indeterminate, so clamp it first. */
const limit = computed(() => (props.max > 0 ? props.max : 100))
const clamped = computed(() => Math.min(Math.max(props.value, 0), limit.value))

/*
 * Reka names the bar after its percentage by default. The value belongs in
 * `aria-valuetext`, as Radix has it, so the name stays the caller's.
 */
function valueText(value: number | null | undefined, max: number) {
  if (value === null || value === undefined) return undefined
  return props.getValueLabel(value, max)
}
function noLabel() {
  return undefined
}
</script>

<template>
  <ProgressRoot
    :as="props.as"
    :as-child="props.asChild"
    :model-value="clamped"
    :max="limit"
    :get-value-text="valueText"
    :get-value-label="noLabel"
    :class="
      cn('h-2 w-full overflow-hidden rounded-full bg-newt-bg-base', props.class)
    "
  >
    <ProgressIndicator
      :class="
        cn(progressVariants({ variant: props.variant }), props.indicatorClass)
      "
      :style="{ width: `${(clamped / limit) * 100}%` }"
    />
  </ProgressRoot>
</template>
