<script setup lang="ts">
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  useForwardPropsEmits,
  type SliderRootEmits,
  type SliderRootProps,
} from "reka-ui"
import { computed, useAttrs, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { SliderMark } from "."

/*
 * Reka owns the behaviour: pointer and touch dragging, arrow keys, Page Up
 * and Page Down, Home and End, and the hidden input a form reads. Only the
 * look is newt/ui's. The value is an array, one entry per grabber.
 * Attributes other than `class` land on the slider root.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<
    SliderRootProps & {
      class?: HTMLAttributes["class"]
      /** Labelled points along the track. */
      marks?: readonly SliderMark[]
    }
  >(),
  { min: 0, max: 100, marks: () => [] }
)
const emits = defineEmits<SliderRootEmits>()

const delegated = computed(() => {
  const {
    class: _class,
    marks: _marks,
    defaultValue: _defaultValue,
    ...rest
  } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)

/* Reka starts an uncontrolled slider at 0; ours starts at `min`. */
const initial = computed(() => props.defaultValue ?? [props.min])
const thumbs = computed(() => (props.modelValue ?? initial.value).length)

/*
 * `role="slider"` is on the grabber, so that is where the name goes. Two
 * grabbers keep Reka's "Minimum" and "Maximum", and the name moves to a
 * group around them.
 */
const THUMB_ATTRS = new Set(["aria-label", "aria-labelledby", "aria-valuetext"])
const attrs = useAttrs()
const single = computed(() => thumbs.value === 1)

const rootAttrs = computed(() => {
  const rest = Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !THUMB_ATTRS.has(name))
  )
  if (single.value) return rest
  return {
    ...rest,
    role: "group",
    "aria-label": attrs["aria-label"],
    "aria-labelledby": attrs["aria-labelledby"],
  }
})
const thumbAttrs = computed(() =>
  single.value
    ? Object.fromEntries(
        Object.entries(attrs).filter(([name]) => THUMB_ATTRS.has(name))
      )
    : {}
)

function ratioOf(point: number): number {
  const span = props.max - props.min
  return span === 0 ? 0 : Math.min(1, Math.max(0, (point - props.min) / span))
}
</script>

<template>
  <div
    :class="
      cn(
        'flex w-full flex-col gap-1',
        props.disabled && 'opacity-50',
        props.class
      )
    "
  >
    <!-- Inset by half a grabber, which is where the grabber's centre stops. -->
    <div
      v-if="props.marks.length > 0"
      aria-hidden="true"
      class="relative mx-[5px] h-[22px]"
    >
      <span
        v-for="mark in props.marks"
        :key="mark.value"
        class="absolute top-0 flex translate-x-[calc(var(--newt-dir)*-50%)] flex-col items-center gap-0.5 text-[10px] font-bold leading-3 text-newt-text-muted after:h-1.5 after:w-0.5 after:rounded-full after:bg-newt-bg-active after:content-['']"
        :style="{ insetInlineStart: `${ratioOf(mark.value) * 100}%` }"
      >
        {{ mark.label ?? mark.value }}
      </span>
    </div>
    <SliderRoot
      v-bind="{ ...forwarded, ...rootAttrs }"
      :default-value="initial"
      class="relative flex h-6 w-full cursor-pointer touch-none select-none items-center data-[disabled]:cursor-not-allowed"
    >
      <SliderTrack
        class="relative h-2 w-full grow overflow-hidden rounded-full bg-newt-bg-active"
      >
        <SliderRange class="absolute h-full bg-newt-brand" />
      </SliderTrack>
      <SliderThumb
        v-for="index in thumbs"
        :key="index"
        v-bind="thumbAttrs"
        class="block h-6 w-2.5 rounded-sm border border-newt-border bg-newt-on-accent shadow-elevation-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
      />
    </SliderRoot>
  </div>
</template>
