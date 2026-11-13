<script setup lang="ts">
import {
  ContextMenuSeparator,
  useForwardProps,
  type ContextMenuSeparatorProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  ContextMenuSeparatorProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ContextMenuSeparator
    v-bind="forwarded"
    :class="cn('mx-1.5 my-1 h-px bg-newt-border', props.class)"
  />
</template>
