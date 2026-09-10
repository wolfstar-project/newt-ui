<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { pollKey } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** What this answer is called in the poll's value. */
    value: string
    /** How many people picked it. */
    votes?: number
    /** The emoji beside the answer, if it has one. */
    emoji?: string
    disabled?: boolean
  }>(),
  { votes: 0, disabled: false }
)

const poll = inject(pollKey)
if (poll === undefined) {
  throw new Error("<PollAnswer> must be used inside a <Poll>.")
}

const chosen = computed(() => poll.selected.value.includes(props.value))
const share = computed(() =>
  poll.total.value === 0
    ? 0
    : Math.round((props.votes / poll.total.value) * 100)
)
</script>

<template>
  <button
    type="button"
    :aria-pressed="chosen"
    :disabled="props.disabled"
    :data-chosen="chosen ? true : undefined"
    :class="
      cn(
        'relative flex items-center gap-3 overflow-hidden rounded-md border border-newt-border bg-newt-bg-base px-3 py-2.5 text-start text-sm text-newt-text-secondary',
        'transition-colors duration-fast ease-newt hover:border-newt-text-muted',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        'data-[chosen]:border-newt-brand data-[chosen]:text-newt-text-primary',
        props.disabled && 'cursor-not-allowed opacity-60',
        props.class
      )
    "
    @click="poll.choose(props.value)"
  >
    <!--
      The bar sits behind the label rather than beside it: the row keeps its
      height whatever the result is, so the list does not shuffle when the
      votes land.
    -->
    <span
      v-if="poll.showResults.value"
      aria-hidden="true"
      :style="{ inlineSize: `${share}%` }"
      class="absolute inset-y-0 start-0 bg-newt-brand/25"
    />
    <span
      v-if="props.emoji"
      aria-hidden="true"
      class="relative shrink-0 text-base"
    >
      {{ props.emoji }}
    </span>
    <span class="relative min-w-0 flex-1 truncate"><slot /></span>
    <span
      v-if="poll.showResults.value"
      class="relative shrink-0 text-xs tabular-nums text-newt-text-muted"
    >
      {{ share }}%
    </span>
  </button>
</template>
