<script setup lang="ts">
import {
  ToastDescription,
  useForwardProps,
  type ToastDescriptionProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  ToastDescriptionProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToastDescription
    v-bind="forwarded"
    :class="
      cn('mt-0.5 text-[13px] text-[var(--newt-text-secondary)]', props.class)
    "
  >
    <slot />
  </ToastDescription>
</template>
