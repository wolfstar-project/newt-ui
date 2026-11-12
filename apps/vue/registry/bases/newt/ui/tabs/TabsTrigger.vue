<script setup lang="ts">
import { TabsTrigger, useForwardProps, type TabsTriggerProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  TabsTriggerProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <TabsTrigger
    v-bind="forwarded"
    :class="
      cn(
        'cursor-pointer rounded-sm border-0 bg-transparent px-3.5 py-1.5 text-[13px] font-medium text-newt-text-muted transition-all duration-fast ease-newt',
        'data-[state=active]:bg-newt-bg-elevated data-[state=active]:text-newt-text-primary',
        'data-[state=inactive]:hover:text-newt-text-secondary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-newt-text-link',
        'disabled:pointer-events-none disabled:opacity-50',
        props.class
      )
    "
  >
    <slot />
  </TabsTrigger>
</template>
