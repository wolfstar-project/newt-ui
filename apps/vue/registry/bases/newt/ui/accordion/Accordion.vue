<script setup lang="ts">
import {
  AccordionRoot,
  useForwardPropsEmits,
  type AccordionRootEmits,
  type AccordionRootProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * Reka owns the behaviour: which sections are open, the arrow keys, Home and
 * End between the headings, and the ids that link each heading to its panel.
 * Use `v-model` to control it. Only the look is newt/ui's. Without a `type`
 * it is `single` and `collapsible`, so the open section also closes on a
 * second press.
 */
const props = withDefaults(
  defineProps<AccordionRootProps & { class?: HTMLAttributes["class"] }>(),
  { type: "single", collapsible: true }
)
const emits = defineEmits<AccordionRootEmits>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <AccordionRoot
    v-bind="forwarded"
    :class="
      cn(
        'flex w-full flex-col overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface',
        props.class
      )
    "
  >
    <slot />
  </AccordionRoot>
</template>
