<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { controlClassName } from "."

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const model = defineModel<string>()
</script>

<template>
  <textarea
    v-model="model"
    :class="cn(controlClassName, 'min-h-[80px] resize-y', props.class)"
  />
</template>
