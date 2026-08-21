<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { avatarVariants, type AvatarVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  size?: AvatarVariants["size"]
}>()
</script>

<template>
  <div :class="cn(avatarVariants({ size: props.size }), props.class)">
    <slot />
  </div>
</template>
