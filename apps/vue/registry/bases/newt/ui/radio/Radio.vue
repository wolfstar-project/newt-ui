<script setup lang="ts">
import {
  RadioGroupIndicator,
  RadioGroupItem,
  useForwardPropsEmits,
  type RadioGroupItemEmits,
  type RadioGroupItemProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  RadioGroupItemProps & {
    class?: HTMLAttributes["class"]
    /** A second line, when the choice needs a sentence to explain it. */
    description?: string
  }
>()
const emits = defineEmits<RadioGroupItemEmits>()

const delegated = computed(() => {
  const { class: _class, description: _description, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <RadioGroupItem
    v-bind="forwarded"
    :class="
      cn(
        'group flex cursor-pointer items-center gap-3 border-0 bg-transparent px-1 py-2 text-start font-sans text-[15px] leading-5 text-newt-text-secondary',
        'hover:text-newt-text-primary focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        'data-[state=checked]:text-newt-text-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  >
    <!--
      The indicator stays mounted so it can be the ring as well as the dot:
      it carries `data-state`, and the dot grows from nothing. A disabled row
      does not answer the pointer, checked or not.
    -->
    <RadioGroupIndicator
      force-mount
      aria-hidden="true"
      :class="
        cn(
          'relative h-5 w-5 shrink-0 rounded-full border-2 border-newt-text-muted transition-colors duration-fast ease-newt',
          'after:absolute after:top-1/2 after:start-1/2 after:h-2 after:w-2 after:rounded-full after:bg-newt-on-accent after:content-[\'\']',
          'after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(0)]',
          'data-[state=checked]:border-newt-brand data-[state=checked]:bg-newt-brand',
          'data-[state=checked]:after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(1)]',
          'group-hover:border-newt-text-secondary',
          'data-[disabled]:data-[state=unchecked]:group-hover:border-newt-text-muted data-[disabled]:data-[state=checked]:group-hover:border-newt-brand'
        )
      "
    />
    <span v-if="props.description" class="flex min-w-0 flex-col gap-0.5">
      <span><slot /></span>
      <span class="text-[13px] leading-[17px] text-newt-text-muted">
        {{ props.description }}
      </span>
    </span>
    <slot v-else />
  </RadioGroupItem>
</template>
