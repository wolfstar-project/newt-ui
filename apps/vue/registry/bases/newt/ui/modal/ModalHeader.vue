<script setup lang="ts">
import { inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { MODAL_CONTEXT_KEY } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const ctx = inject(MODAL_CONTEXT_KEY, null)
</script>

<template>
  <div
    :id="ctx?.titleId"
    :class="cn('px-4 pt-4 text-xl font-semibold', props.class)"
  >
    <slot />
  </div>
</template>
