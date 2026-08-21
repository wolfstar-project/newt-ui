<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { TOAST_INJECTION_KEY, toastIconVariants } from "."

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const ctx = inject(TOAST_INJECTION_KEY, null)
const variant = computed(() => ctx?.variant.value ?? "success")
</script>

<template>
  <div
    aria-hidden="true"
    :class="cn(toastIconVariants({ variant }), props.class)"
  >
    <slot>{{ variant === "success" ? "✓" : "!" }}</slot>
  </div>
</template>
