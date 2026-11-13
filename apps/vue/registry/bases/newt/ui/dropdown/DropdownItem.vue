<script setup lang="ts">
import {
  DropdownMenuItem,
  useForwardPropsEmits,
  type DropdownMenuItemEmits,
  type DropdownMenuItemProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { dropdownItemVariants, type DropdownItemVariants } from "."

const props = defineProps<
  DropdownMenuItemProps & {
    class?: HTMLAttributes["class"]
    variant?: DropdownItemVariants["variant"]
  }
>()
const emits = defineEmits<DropdownMenuItemEmits>()

const delegated = computed(() => {
  const { class: _class, variant: _variant, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuItem
    v-bind="forwarded"
    :class="cn(dropdownItemVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </DropdownMenuItem>
</template>
