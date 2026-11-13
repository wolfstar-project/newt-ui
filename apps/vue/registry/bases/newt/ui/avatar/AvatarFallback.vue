<script setup lang="ts">
import { AvatarFallback, type AvatarFallbackProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  AvatarFallbackProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <AvatarFallback
    v-bind="delegated"
    :class="cn('flex h-full w-full items-center justify-center', props.class)"
  >
    <slot />
  </AvatarFallback>
</template>
