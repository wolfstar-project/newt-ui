<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { alertVariants, type AlertVariants } from "."

/*
 * A notice that sits in the page, where a toast floats over it. What kind of
 * notice it is shows three ways: the bar down its leading edge, the icon's
 * shape and the words. A `danger` alert is announced at once (`role="alert"`);
 * the others wait their turn (`role="status"`).
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    variant?: NonNullable<AlertVariants["variant"]>
    /** Overrides the role the variant would pick. */
    role?: string
  }>(),
  { variant: "info" }
)

/* One shape per kind, so the kind survives without its colour. */
const ICONS = {
  info: "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm-.8 3.4a.8.8 0 0 1 1.6 0v3.6a.8.8 0 0 1-1.6 0V7.6Z",
  success:
    "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm3.2 5.5-3.6 3.9a.8.8 0 0 1-1.2 0L4.8 8.7a.8.8 0 1 1 1.2-1.1l1 1.1 3-3.3a.8.8 0 0 1 1.2 1.1Z",
  warning:
    "M8.9 1.5a1 1 0 0 0-1.8 0L.6 13.2A1 1 0 0 0 1.5 14.7h13a1 1 0 0 0 .9-1.5L8.9 1.5ZM8 5.5a.8.8 0 0 1 .8.8v3.2a.8.8 0 0 1-1.6 0V6.3a.8.8 0 0 1 .8-.8Zm0 7.2a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z",
  danger:
    "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3.5a.8.8 0 0 1 .8.8v3.4a.8.8 0 0 1-1.6 0V5.3a.8.8 0 0 1 .8-.8Zm0 7.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z",
} as const

const resolvedRole = computed(
  () => props.role ?? (props.variant === "danger" ? "alert" : "status")
)
</script>

<template>
  <div
    :role="resolvedRole"
    :data-variant="props.variant"
    :class="cn(alertVariants({ variant: props.variant }), props.class)"
  >
    <svg viewBox="0 0 16 16" aria-hidden="true" class="h-5 w-5 shrink-0">
      <path fill="currentColor" :d="ICONS[props.variant]" />
    </svg>
    <div class="flex min-w-0 flex-1 flex-col gap-0.5"><slot /></div>
  </div>
</template>
