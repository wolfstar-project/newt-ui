<script setup lang="ts">
import { TabsList, type TabsListProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<TabsListProps & { class?: HTMLAttributes["class"] }>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <TabsList
    v-bind="delegated"
    :class="
      cn(
        'flex w-fit max-w-full gap-1 overflow-x-auto rounded-[var(--newt-radius-md)] bg-newt-bg-base p-1',
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>
