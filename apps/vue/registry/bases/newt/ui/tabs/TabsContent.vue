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
if (!ctx) throw new Error("<TabsContent> must be used within <Tabs>")

const active = computed(() => ctx.value.value === props.value)
</script>

<template>
  <div
    v-if="active"
    role="tabpanel"
    data-state="active"
    :class="cn('mt-2', props.class)"
  >
    <slot />
  </div>
</template>
