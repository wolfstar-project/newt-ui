<script setup lang="ts">
import {
  RadioGroupRoot,
  useForwardPropsEmits,
  type RadioGroupRootEmits,
  type RadioGroupRootProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * A radio group: one choice out of a short, visible list. Where a select menu
 * hides its options until asked, this shows them all, which is what the
 * client's settings panels use when there are two or three of them and the
 * difference between them matters.
 *
 * Reka owns the behaviour: the value, the single tab stop, the arrow keys
 * and the hidden input a form reads. Only the look is newt/ui's.
 */
const props = defineProps<
  RadioGroupRootProps & {
    class?: HTMLAttributes["class"]
    /** Accessible name for the group. */
    label?: string
  }
>()
const emits = defineEmits<RadioGroupRootEmits>()

const delegated = computed(() => {
  const { class: _class, label: _label, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <RadioGroupRoot
    v-bind="forwarded"
    :aria-label="props.label"
    :class="cn('flex flex-col gap-1', props.class)"
  >
    <slot />
  </RadioGroupRoot>
</template>
