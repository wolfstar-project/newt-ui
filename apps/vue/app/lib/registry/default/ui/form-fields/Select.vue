<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { controlClassName } from "."

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const model = defineModel<string | number>()
</script>

<template>
  <select v-model="model" :class="cn(controlClassName, props.class)">
    <slot />
  </select>
</template>
