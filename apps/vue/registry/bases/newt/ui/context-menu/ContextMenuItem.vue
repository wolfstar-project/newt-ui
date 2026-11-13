<script setup lang="ts">
import {
  ContextMenuItem,
  useForwardPropsEmits,
  type ContextMenuItemEmits,
  type ContextMenuItemProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { contextMenuItemVariants, type ContextMenuItemVariants } from "."

const props = defineProps<
  ContextMenuItemProps & {
    class?: HTMLAttributes["class"]
    variant?: ContextMenuItemVariants["variant"]
  }
>()
const emits = defineEmits<ContextMenuItemEmits>()

const delegated = computed(() => {
  const { class: _class, variant: _variant, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuItem
    v-bind="forwarded"
    :class="
      cn(contextMenuItemVariants({ variant: props.variant }), props.class)
    "
  >
    <slot />
  </ContextMenuItem>
</template>
