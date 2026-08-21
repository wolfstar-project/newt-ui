<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed, inject } from "vue"

import { cn } from "@/lib/utils"

import { TABS_INJECTION_KEY } from "."

const props = defineProps<{
  value: string
  class?: HTMLAttributes["class"]
}>()

const ctx = inject(TABS_INJECTION_KEY)
if (!ctx) throw new Error("<TabsTrigger> must be used within <Tabs>")

const active = computed(() => ctx.value.value === props.value)
</script>

<template>
  <button
    type="button"
    role="tab"
    :aria-selected="active"
    :data-state="active ? 'active' : 'inactive'"
    :tabindex="active ? 0 : -1"
    :class="
      cn(
        'cursor-pointer rounded-sm border-0 bg-transparent px-3.5 py-1.5 text-[13px] font-medium text-newt-text-muted transition-all duration-fast ease-newt',
        'data-[state=active]:bg-newt-bg-elevated data-[state=active]:text-newt-text-primary',
        'data-[state=inactive]:hover:text-newt-text-secondary',
        props.class
      )
    "
    @click="ctx.setValue(props.value)"
  >
    <slot />
  </button>
</template>
