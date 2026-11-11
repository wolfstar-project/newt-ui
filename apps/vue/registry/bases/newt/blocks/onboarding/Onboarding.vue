<script setup lang="ts">
import { computed, nextTick, ref, type HTMLAttributes } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import { Stepper, type StepperStep } from "~~/registry/bases/newt/ui/stepper"

import { cn } from "@/lib/utils"

import type { OnboardingLabels } from "./types"

/*
 * A short setup flow: where you are in it, the current step's own content,
 * and the two buttons that move through it. The content is the default slot,
 * which is handed the step's index, so each step stays an ordinary component
 * of yours and the block only owns the order. Moving to another step moves
 * focus to its heading, so a screen reader starts from the new content.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    steps: readonly StepperStep[]
    /** Whether the current step may be left. */
    canContinue?: boolean
    labels?: OnboardingLabels
  }>(),
  {
    canContinue: true,
    labels: () => ({ back: "Back", next: "Next", finish: "Finish" }),
  }
)

const emit = defineEmits<{
  /** Fired when the last step's button is pressed. */
  (e: "complete"): void
}>()

/** Index of the step being shown. Use `v-model:step` to control it. */
const step = defineModel<number>("step", { default: 0 })

const heading = ref<HTMLHeadingElement | null>(null)
const current = computed(() => Math.min(step.value, props.steps.length - 1))
const last = computed(() => current.value === props.steps.length - 1)

async function goTo(next: number) {
  step.value = next
  await nextTick()
  heading.value?.focus()
}

function forward() {
  if (last.value) emit("complete")
  else void goTo(current.value + 1)
}
</script>

<template>
  <section
    :class="
      cn(
        'flex w-full flex-col gap-6 rounded-lg border border-newt-border bg-newt-bg-surface p-6',
        props.class
      )
    "
  >
    <Stepper :steps="props.steps" :value="current" />
    <div class="flex flex-col gap-4">
      <h2
        ref="heading"
        tabindex="-1"
        class="m-0 text-lg font-semibold leading-6 text-newt-text-primary focus:outline-none"
      >
        {{ props.steps[current]?.title }}
      </h2>
      <slot :step="current" />
    </div>
    <div class="flex justify-between gap-2">
      <Button
        variant="secondary"
        :disabled="current === 0"
        @click="goTo(current - 1)"
      >
        {{ props.labels.back }}
      </Button>
      <Button :disabled="!props.canContinue" @click="forward">
        {{ last ? props.labels.finish : props.labels.next }}
      </Button>
    </div>
  </section>
</template>
