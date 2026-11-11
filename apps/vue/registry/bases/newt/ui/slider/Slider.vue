<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { SliderMark } from "."

/*
 * A real `<input type="range">` does the work: arrow keys, Home and End, the
 * announced value and touch dragging are all the browser's. It is laid over
 * the drawing and made transparent, so the track, the fill and the grabber
 * are plain boxes placed by one ratio. Attributes other than `class` land on
 * that input.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    min?: number
    max?: number
    step?: number
    /** Labelled points along the track. */
    marks?: readonly SliderMark[]
    disabled?: boolean
  }>(),
  { min: 0, max: 100, step: 1, marks: () => [], disabled: false }
)

const model = defineModel<number>()

/* The grabber's width; the track is inset by half of it at each end. */
const THUMB = 10

const current = computed(() => model.value ?? props.min)

function ratioOf(point: number): number {
  const span = props.max - props.min
  return span === 0 ? 0 : Math.min(1, Math.max(0, (point - props.min) / span))
}

const ratio = computed(() => ratioOf(current.value))

function onInput(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    model.value = Number(event.target.value)
  }
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
    <div
      v-if="props.marks.length > 0"
      aria-hidden="true"
      class="relative h-[22px]"
      :style="{ marginInline: `${THUMB / 2}px` }"
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
    <div class="relative flex h-6 items-center">
      <input
        v-bind="$attrs"
        type="range"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :value="current"
        :disabled="props.disabled"
        :class="
          cn(
            'peer absolute inset-0 z-[1] m-0 h-full w-full opacity-0',
            props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          )
        "
        @input="onInput"
      />
      <div class="h-2 w-full overflow-hidden rounded-full bg-newt-bg-active">
        <div
          class="h-full bg-newt-brand"
          :style="{
            width: `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${ratio})`,
          }"
        />
      </div>
      <div
        class="pointer-events-none absolute top-0 h-6 rounded-sm border border-newt-border bg-white shadow-elevation-low peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-newt-text-link"
        :style="{
          width: `${THUMB}px`,
          insetInlineStart: `calc((100% - ${THUMB}px) * ${ratio})`,
        }"
      />
    </div>
  </div>
</template>
