<script setup lang="ts">
import {
  ContextMenuLabel,
  useForwardProps,
  type ContextMenuLabelProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  ContextMenuLabelProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ContextMenuLabel
    v-bind="forwarded"
    :class="
      cn(
        'px-2 py-1.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </ContextMenuLabel>
</template>
