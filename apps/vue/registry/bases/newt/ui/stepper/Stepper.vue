<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import type { StepperStep } from "."

/*
 * Progress through a fixed sequence, as an ordered list. A step's state is
 * said three ways, so it never rests on colour: the marker's fill, a check
 * in place of the number, and `aria-current="step"` on the one in progress.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    steps: readonly StepperStep[]
    /**
     * Index of the step in progress. Every step before it is complete; a
     * value equal to `steps.length` means all of them are.
     */
    value: number
    orientation?: "horizontal" | "vertical"
    /** Read after a finished step's title by a screen reader. */
    completedLabel?: string
  }>(),
  { orientation: "horizontal", completedLabel: "completed" }
)

const vertical = computed(() => props.orientation === "vertical")
</script>

<template>
  <ol
    :data-orientation="props.orientation"
    :class="
      cn(
        'm-0 flex w-full list-none p-0',
        vertical ? 'flex-col' : 'gap-2',
        props.class
      )
    "
  >
    <li
      v-for="(step, index) in props.steps"
      :key="step.title"
      :aria-current="index === props.value ? 'step' : undefined"
      :class="
        cn(
          'relative flex min-w-0',
          vertical
            ? 'items-start gap-3 text-start'
            : 'flex-1 flex-col items-center gap-2 text-center',
          vertical && index < props.steps.length - 1 && 'pb-5'
        )
      "
    >
      <span
        v-if="index < props.steps.length - 1"
        aria-hidden="true"
        :class="
          cn(
            'absolute rounded-full',
            index < props.value ? 'bg-newt-brand' : 'bg-newt-bg-active',
            vertical
              ? 'start-[13px] top-8 h-[calc(100%-36px)] w-0.5'
              : 'start-[calc(50%+20px)] top-[13px] h-0.5 w-[calc(100%-32px)]'
          )
        "
      />
      <span
        aria-hidden="true"
        :class="
          cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold',
            index < props.value
              ? 'border-newt-brand bg-newt-brand text-white'
              : index === props.value
                ? 'border-newt-brand bg-newt-bg-surface text-newt-text-primary'
                : 'border-newt-bg-active bg-newt-bg-surface text-newt-text-muted'
          )
        "
      >
        <svg v-if="index < props.value" viewBox="0 0 16 16" class="h-4 w-4">
          <path
            fill="currentColor"
            d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
          />
        </svg>
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span :class="cn('flex min-w-0 flex-col gap-0.5', vertical && 'pt-1')">
        <span
          :class="
            cn(
              'text-sm font-semibold leading-[18px]',
              index <= props.value
                ? 'text-newt-text-primary'
                : 'text-newt-text-secondary'
            )
          "
        >
          {{ step.title
          }}<span v-if="index < props.value" class="sr-only"
            >, {{ props.completedLabel }}</span
          >
        </span>
        <span
          v-if="step.description !== undefined"
          class="text-xs leading-4 text-newt-text-muted"
        >
          {{ step.description }}
        </span>
      </span>
    </li>
  </ol>
</template>
