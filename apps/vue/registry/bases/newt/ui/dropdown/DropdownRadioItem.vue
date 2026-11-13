<script setup lang="ts">
import {
  DropdownMenuRadioItem,
  useForwardPropsEmits,
  type DropdownMenuRadioItemEmits,
  type DropdownMenuRadioItemProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { dropdownItemVariants, type DropdownItemVariants } from "."

/*
 * The checked item keeps the brand fill, so the highlight on it is an inset
 * outline: without it the keyboard position is lost on the chosen item.
 */
const props = defineProps<
  DropdownMenuRadioItemProps & {
    class?: HTMLAttributes["class"]
    variant?: DropdownItemVariants["variant"]
  }
>()
const emits = defineEmits<DropdownMenuRadioItemEmits>()

const delegated = computed(() => {
  const { class: _class, variant: _variant, ...rest } = props
  return rest
})
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuRadioItem
    v-bind="forwarded"
    :class="
      cn(
        dropdownItemVariants({ variant: props.variant }),
        'data-[state=checked]:bg-newt-brand',
        'data-[state=checked]:data-[highlighted]:outline data-[state=checked]:data-[highlighted]:outline-2 data-[state=checked]:data-[highlighted]:-outline-offset-2 data-[state=checked]:data-[highlighted]:outline-newt-on-accent',
        props.class
      )
    "
  >
    <slot />
  </DropdownMenuRadioItem>
</template>
