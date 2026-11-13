<script setup lang="ts">
import {
  DropdownMenuSeparator,
  useForwardProps,
  type DropdownMenuSeparatorProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  DropdownMenuSeparatorProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuSeparator
    v-bind="forwarded"
    :class="cn('mx-1.5 my-1 h-px bg-newt-border', props.class)"
  />
</template>
