<script setup lang="ts">
import { AvatarRoot, type AvatarRootProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { avatarVariants, type AvatarVariants } from "."

/*
 * Reka owns the image state: `AvatarImage` shows once its source has loaded,
 * and `AvatarFallback` shows until then and when the load fails. Only the
 * look is newt/ui's.
 */
const props = defineProps<
  AvatarRootProps & {
    class?: HTMLAttributes["class"]
    size?: AvatarVariants["size"]
  }
>()

const delegated = computed(() => {
  const { class: _class, size: _size, ...rest } = props
  return rest
})
</script>

<template>
  <AvatarRoot
    v-bind="delegated"
    :class="cn(avatarVariants({ size: props.size }), props.class)"
  >
    <slot />
  </AvatarRoot>
</template>
