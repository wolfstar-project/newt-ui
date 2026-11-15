<script setup lang="ts">
import { ref, type Component, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * The image element or component to render. Defaults to `img`; pass
     * `NuxtImg` or another image component for optimised sources. It
     * receives `src`, `alt`, `class` and the spoiler attributes and handlers.
     */
    as?: string | Component
    src: string
    alt?: string
    /**
     * Marks the image as a spoiler: blurred until clicked, the same treatment
     * a spoilered attachment gets.
     */
    spoiler?: boolean
    /** Accessible name of a hidden spoiler, read in place of the image. */
    spoilerLabel?: string
  }>(),
  {
    as: "img",
    alt: "",
    spoiler: false,
    spoilerLabel: "Spoiler, click to reveal",
  }
)

const revealed = ref(false)

function reveal() {
  revealed.value = true
}

function onKeydown(event: KeyboardEvent) {
  if (revealed.value || !props.spoiler) return
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    reveal()
  }
}
</script>

<template>
  <component
    :is="props.as"
    :src="props.src"
    :alt="props.alt"
    :data-spoiler="props.spoiler && !revealed ? true : undefined"
    :role="props.spoiler && !revealed ? 'button' : undefined"
    :tabindex="props.spoiler && !revealed ? 0 : undefined"
    :aria-label="props.spoiler && !revealed ? props.spoilerLabel : undefined"
    :class="
      cn(
        'h-[85px] w-[85px] rounded-[var(--newt-radius-lg)] object-cover',
        props.spoiler && !revealed && 'cursor-pointer blur-lg',
        props.class
      )
    "
    @click="reveal"
    @keydown="onKeydown"
  />
</template>
