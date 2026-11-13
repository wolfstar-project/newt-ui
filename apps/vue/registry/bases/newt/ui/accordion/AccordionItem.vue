<script setup lang="ts">
import {
  AccordionItem,
  useForwardProps,
  type AccordionItemProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  AccordionItemProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <AccordionItem
    v-bind="forwarded"
    :class="
      cn('border-newt-border [&:not(:first-child)]:border-t', props.class)
    "
  >
    <slot />
  </AccordionItem>
</template>
