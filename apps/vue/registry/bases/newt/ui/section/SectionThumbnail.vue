<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    src: string
    alt?: string
    /**
     * Marks the image as a spoiler: blurred until clicked, the same treatment
     * a spoilered attachment gets.
     */
    spoiler?: boolean
  }>(),
  { alt: "", spoiler: false }
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
  <img
    :src="props.src"
    :alt="props.alt"
    :data-spoiler="props.spoiler && !revealed ? true : undefined"
    :role="props.spoiler && !revealed ? 'button' : undefined"
    :tabindex="props.spoiler && !revealed ? 0 : undefined"
    :aria-label="
      props.spoiler && !revealed ? 'Spoiler, click to reveal' : undefined
    "
    :class="
      cn(
        'h-[86px] w-[86px] rounded-lg object-cover',
        props.spoiler && !revealed && 'cursor-pointer blur-lg',
        props.class
      )
    "
    @click="reveal"
    @keydown="onKeydown"
  />
</template>
