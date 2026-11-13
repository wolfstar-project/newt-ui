<script setup lang="ts">
import {
  DropdownMenuLabel,
  useForwardProps,
  type DropdownMenuLabelProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  DropdownMenuLabelProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuLabel
    v-bind="forwarded"
    :class="
      cn(
        'px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </DropdownMenuLabel>
</template>
