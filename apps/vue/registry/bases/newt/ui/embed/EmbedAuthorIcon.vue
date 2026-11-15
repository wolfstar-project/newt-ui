<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * The image element or component to render. Defaults to `img`; pass
     * `NuxtImg` or another image component for optimised sources.
     */
    as?: string | Component
    src: string
    alt?: string
  }>(),
  { as: "img", alt: "" }
)
</script>

<template>
  <component
    :is="props.as"
    :src="props.src"
    :alt="props.alt"
    :aria-hidden="props.alt === '' ? true : undefined"
    :class="cn('h-6 w-6 shrink-0 rounded-full object-cover', props.class)"
  />
</template>
