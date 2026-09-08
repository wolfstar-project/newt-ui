<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * `invalid` marks the whole field. The controls inside read `data-invalid`
 * from this wrapper, so a form library that only knows "this field is in
 * error" says it once rather than per control.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  invalid?: boolean
}>()
</script>

<template>
  <div
    :data-invalid="props.invalid || undefined"
    :class="cn('group/field flex flex-col gap-2', props.class)"
  >
    <slot />
  </div>
</template>
