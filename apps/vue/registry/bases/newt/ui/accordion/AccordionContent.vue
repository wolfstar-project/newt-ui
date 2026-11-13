<script setup lang="ts">
import {
  AccordionContent,
  useForwardProps,
  type AccordionContentProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  AccordionContentProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <AccordionContent
    v-bind="forwarded"
    :class="
      cn('px-4 pb-3.5 text-sm leading-5 text-newt-text-secondary', props.class)
    "
  >
    <slot />
  </AccordionContent>
</template>
